# Vendure Plugin Template

A monorepo template for creating Vendure plugins with support for both the **legacy Angular Admin UI** and the **new React Dashboard**. Both can run simultaneously.

## Structure

```
plugin-template/
├── package.json                  # Workspace config & shared devDependencies
├── packages/
│   └── example-plugin/
│       ├── src/
│       │   ├── index.ts              # Plugin entry (exported to consumers)
│       │   ├── example.plugin.ts     # @VendurePlugin definition
│       │   ├── ui/                   # Angular Admin UI extension (legacy)
│       │   └── dashboard/            # React Dashboard extension (new)
│       │       └── index.tsx         # Dashboard entry point
│       ├── dev-server/
│       │   ├── index.ts              # Bootstraps the dev Vendure server
│       │   └── vendure-config.ts     # Dev config with both UI plugins
│       ├── e2e/                      # End-to-end tests
│       ├── vite.config.mts           # Vite config for Dashboard dev/build
│       ├── tsconfig.json             # Base TS config
│       ├── tsconfig.build.json       # TS config for npm build (excludes dashboard/)
│       ├── tsconfig.dashboard.json   # TS config for React/JSX (used by Vite & IDE)
│       ├── copy-ui-src.ts            # Copies ui/ & dashboard/ source into dist/
│       └── package.json
└── utils/
    └── e2e/                          # Shared e2e helpers
```

## Getting Started

```bash
git clone <this-repo>
cd plugin-template
npm install
cd packages/example-plugin
npm run dev
```

This starts the Vendure server and the Vite Dashboard dev server concurrently:

| Interface            | URL                             |
| -------------------- | ------------------------------- |
| Angular Admin UI     | http://localhost:3000/admin     |
| React Dashboard      | http://localhost:3000/dashboard |
| Admin API Playground | http://localhost:3000/admin-api |

Login: `superadmin` / `superadmin`

## Where Things Go

### Server-side code (`src/`)

Your entities, services, resolvers, and GraphQL schema extensions. This is compiled by `tsc` during `npm run build`.

### Angular Admin UI (`src/ui/`)

Legacy Angular extensions. Registered via a static property on the plugin class:

```ts
export class ExamplePlugin {
  static uiExtensions = ui;
}
```

Compiled at dev/build time by `compileUiExtensions()` (Angular CLI). Uses the existing `codegen` script for GraphQL type generation.

### React Dashboard (`src/dashboard/`)

New React extensions. Registered directly in the `@VendurePlugin` decorator:

```ts
@VendurePlugin({
    // ...
    dashboard: './dashboard/index.tsx',
})
```

The entry file uses `defineDashboardExtension()` from `@vendure/dashboard` to declare routes, page blocks, widgets, action bar items, and custom form components.

For GraphQL type generation in dashboard extensions, use the [IDE GraphQL integration](https://docs.vendure.io/current/core/extending-the-dashboard/extending-overview#ide-graphql-integration) approach rather than the codegen script.

### Vite config (`vite.config.mts`)

Used only during development. The `vendureDashboardPlugin` introspects your `vendure-config.ts` to discover plugins and their dashboard extensions. The `pathAdapter` option handles monorepo path resolution:

```ts
pathAdapter: {
    sourceRoot: resolve(__dirname, '../..'),  // workspace root
    getCompiledConfigPath: ({ outputPath, configFileName }) => {
        return join(outputPath, 'packages/example-plugin/dev-server', configFileName);
    },
},
```

This is needed because in a monorepo the compiled config preserves directory structure relative to the workspace root. See the [PathAdapter docs](https://docs.vendure.io/current/core/reference/dashboard/vite-plugin/vendure-dashboard-plugin#pathadapter).

### Dev server config (`dev-server/vendure-config.ts`)

Registers both UI plugins side-by-side:

- `AdminUiPlugin` — serves the Angular Admin UI
- `DashboardPlugin` — serves the React Dashboard

## Building & Publishing

```bash
npm run build     # Compiles server code + copies ui/ and dashboard/ source to dist/
npm publish
```

Both `ui/` and `dashboard/` are published as **source files**. Consumers compile them at their own build time — Angular CLI handles `ui/`, and Vite handles `dashboard/` automatically by scanning installed plugins for the `dashboard` property.

## Testing

```bash
npm run e2e
```

## Further Reading

- [Extending the Dashboard](https://docs.vendure.io/current/core/extending-the-dashboard/extending-overview)
- [Dashboard: Getting Started](https://docs.vendure.io/current/core/extending-the-dashboard/getting-started/)
- [Dashboard: Monorepo Setup](https://docs.vendure.io/current/core/extending-the-dashboard/getting-started#monorepo-setup)
- [PathAdapter Reference](https://docs.vendure.io/current/core/reference/dashboard/vite-plugin/vendure-dashboard-plugin#pathadapter)
- [Dashboard: Migration from Admin UI](https://docs.vendure.io/current/core/extending-the-dashboard/migration)
- [Publishing a Plugin](https://docs.vendure.io/guides/how-to/publish-plugin/)
