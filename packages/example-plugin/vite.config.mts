import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dashboard',
    build: {
        outDir: join(__dirname, 'dev-server/dashboard'),
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./dev-server/vendure-config.ts'),
            api: { host: 'http://localhost', port: 3000 },
            gqlOutputPath: './src/gql',

            // pathAdapter is required in a monorepo setup.
            //
            // The vendureDashboardPlugin compiles your vendure-config.ts to
            // JavaScript so it can load it and discover which plugins have
            // dashboard extensions. When it compiles, TypeScript preserves
            // the directory structure relative to `sourceRoot`.
            //
            // For example, with sourceRoot set to the workspace root (../..),
            // the compiled config ends up at:
            //   <tempDir>/packages/example-plugin/dev-server/vendure-config.js
            //
            // `getCompiledConfigPath` tells the plugin exactly where the
            // compiled config landed so it can be loaded correctly.
            //
            // If you add a new plugin package, update the path in
            // getCompiledConfigPath to match its location under packages/.
            //
            // See: https://docs.vendure.io/current/core/reference/dashboard/vite-plugin/vendure-dashboard-plugin#pathadapter
            pathAdapter: {
                sourceRoot: resolve(__dirname, '../..'),
                getCompiledConfigPath: ({ outputPath, configFileName }) => {
                    return join(outputPath, 'packages/example-plugin/dev-server', configFileName);
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
