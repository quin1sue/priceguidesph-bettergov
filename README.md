### Ekonotrack

**Ekonotrack** is an economic and financial data platform for transparency and awareness.

It collects and shares various financial and economic information such as gas prices, market prices, currency exchange rates, and more.

### Tech Stack

- [Nextjs](https://nextjs.org/)
- [Cloudflare_R2](https://www.cloudflare.com/developer-platform/products/r2/)
- [Puppeteer](https://pptr.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/)

| Layer                    | Technology                      | Purpose                                |
| ------------------------ | ------------------------------- | -------------------------------------- |
| Frontend                 | Nextjs                          | Render UI, call API                    |
| API Routes               | NextJS API                      | Serve Json, trigger scraping           |
| Web Scraper              | Puppeteer                       | Fetch PDF URLs, Metadata, etc..        |
| PDF Parsing              | `pdf-parse`                     | Extract tables from PDFs into json     |
| Storage (locally)        | Local Json `/cache/latest.json` | Temporary Storage                      |
| Storage (production)     | Cloudflare R2 `Free tier`       | Persistent Json Storage                |
| Background job (locally) | Async API                       | Download & parse new PDFs persistently |

> [!TIP]
> Cloudflare R2 isn't initialized yet in this project.

### Project Flow

```ts
Frontend (Next.js)
    │
    ▼
User visits page → calls /api/data
    │
    ▼
    /api/data checks cached JSON (/cache/latest.json)
    │
    ├─ Returns cached JSON immediately → frontend renders tables/charts
    │
    └─ Checks if a new PDF exists on target website using a web scraper
           │
           ├─ If no new PDF → do nothing
           └─ If new PDF detected → triggers /api/parse-pdf asynchronously
                     │
                     ▼
            /api/parse-pdf downloads PDF
                     │
                     ▼
           Parses tables → converts to JSON
                     │
                     ▼
           Updates cached JSON (latest.json or Cloudflare R2 in production)

```
