### Getting Started

```bash
git clone https://github.com/quin1sue/priceguidesph-bettergov.git
cd <your_directory>
cd ekono-backend
```

## Backend TechStack

- [Hono.js](https://hono.dev/)
- [SQLite](https://sqlite.org/) - Database
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - Database Storage
- [Workers](https://workers.cloudflare.com/) - Backend Hosting

  **Note**: You must have [pnpm](https://pnpm.io/installation) installed in your system.

```txt
pnpm install
pnpm run dev
```

### Others

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types)

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

### Folders

- [Services](https://github.com/quin1sue/priceguidesph-bettergov/tree/main/ekono-backend/src/services/functions)
- [Index](https://github.com/quin1sue/priceguidesph-bettergov/blob/main/ekono-backend/src/index.ts)
- [Bindings](https://github.com/quin1sue/priceguidesph-bettergov/blob/main/ekono-backend/wrangler.jsonc)
