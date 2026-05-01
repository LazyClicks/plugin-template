# Vendure Plugin Template

A monorepo template for creating Vendure plugins with [React Dashboard](https://docs.vendure.io/current/core/extending-the-dashboard/extending-overview) extensions.

## Structure

```
plugin-template/
├── package.json                  # Workspace config & shared devDependencies
├── packages/
│   └── example-plugin/
│       ├── src/
│       │   ├── index.ts              # Plugin entry (exported to consumers)
│       │   ├── example.plugin.ts     # @VendurePlugin definition
│       │   └── dashboard/            # React Dashboard extension
│       │       └── index.tsx         # Dashboard entry point
│       ├── dev-server/
│       │   ├── index.ts              # Bootstraps the dev Vendure server
│       │   └── vendure-config.ts     # Dev server config
│       ├── e2e/                      # End-to-end tests
│       ├── vite.config.mts           # Vite config for Dashboard dev/build
│       ├── tsconfig.json             # Base TS config
│       ├── tsconfig.build.json       # TS config for npm build (excludes dashboard/)
│       ├── tsconfig.dashboard.json   # TS config for React/JSX (used by Vite & IDE)
│       ├── copy-ui-src.ts            # Copies dashboard/ source into dist/
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

| Interface | URL |
|---|---|
| React Dashboard | http://localhost:5173/dashboard |
| Admin API Playground | http://localhost:3000/admin-api |

Login: `superadmin` / `superadmin`

## Where Things Go

### Server-side code (`src/`)

Your entities, services, resolvers, and GraphQL schema extensions. Compiled by `tsc` during `npm run build`.

### Dashboard extension (`src/dashboard/`)

React extensions registered via the `dashboard` property in `@VendurePlugin`:

```ts
@VendurePlugin({
    // ...
    dashboard: './dashboard/index.tsx',
})
```

The entry file uses `defineDashboardExtension()` from `@vendure/dashboard` to declare routes, page blocks, widgets, action bar items, and custom form components.

### GraphQL in Dashboard extensions

For autocomplete and type-checking when working with GraphQL in dashboard code:

1. Install the [GraphQL extension for VS Code](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) or [IntelliJ plugin](https://plugins.jetbrains.com/plugin/8097-graphql)
2. Generate the schema: `npx vendure schema --api admin`
3. Create a `graphql.config.yml` in the project root:
   ```yaml
   schema: 'schema.graphql'
   ```

See the [full IDE GraphQL integration guide](https://docs.vendure.io/current/core/extending-the-dashboard/extending-overview#ide-graphql-integration).

### Vite config (`vite.config.mts`)

Used during development only. The `vendureDashboardPlugin` compiles and loads your `vendure-config.ts` to discover plugins and their dashboard extensions.

The `pathAdapter` option is **required in a monorepo**. It tells the plugin how to resolve paths when the config isn't at the workspace root:

- **`sourceRoot`** — the workspace root. TypeScript preserves directory structure relative to this when compiling the config.
- **`getCompiledConfigPath`** — tells the plugin where the compiled config ended up inside the temp output directory.

See the comments in `vite.config.mts` for a detailed explanation, and the [PathAdapter docs](https://docs.vendure.io/current/core/reference/dashboard/vite-plugin/vendure-dashboard-plugin#pathadapter).

### Dev server config (`dev-server/vendure-config.ts`)

Registers `DashboardPlugin` to serve the Dashboard UI during development.

## Building & Publishing

```bash
npm run build     # Compiles server code + copies dashboard/ source to dist/
npm publish
```

The `dashboard/` directory is published as **source files**. Consumers' Vite builds bundle them automatically by scanning installed plugins for the `dashboard` property.

## Testing

```bash
npm run e2e
```

## Further Reading

- [Extending the Dashboard](https://docs.vendure.io/current/core/extending-the-dashboard/extending-overview)
- [Dashboard: Getting Started](https://docs.vendure.io/current/core/extending-the-dashboard/getting-started/)
- [Dashboard: Monorepo Setup](https://docs.vendure.io/current/core/extending-the-dashboard/getting-started#monorepo-setup)
- [PathAdapter Reference](https://docs.vendure.io/current/core/reference/dashboard/vite-plugin/vendure-dashboard-plugin#pathadapter)
- [Publishing a Plugin](https://docs.vendure.io/guides/how-to/publish-plugin/)
