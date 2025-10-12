# Ekonotrack

**Ekonotrack** is an economic and financial data platform designed to promote transparency and awareness. It collects, parses, and shares financial and economic information such as gas prices, market prices, currency exchange rates, and more.

---

## Features

- Scrapes economic and financial data from trusted sources
- Parses PDF documents to extract structured data
- Provides data via API endpoints for easy access
- Focus on transparency and public awareness

---

## Tech Stack

- [Next.js](https://nextjs.org/) – Frontend and API routes
- [Playwright](https://playwright.dev/) – Web scraping PDFs and data
- [TypeScript](https://www.typescriptlang.org/) – Type-safe code
- [Vercel](https://vercel.com/) – Hosting and deployment
- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) – PDF parsing library

| Layer       | Technology  | Purpose                            |
| ----------- | ----------- | ---------------------------------- |
| Frontend    | Next.js     | Render UI, call API                |
| API Routes  | Next.js API | Serve JSON, trigger scraping       |
| Web Scraper | Playwright  | Fetch PDF URLs, metadata, etc.     |
| PDF Parsing | `pdf-parse` | Extract tables from PDFs into JSON |

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/quin1sue/ekonotrack-ph.bettergov.git
cd <your_directory>
```

2. **Install dependencies**
   **Note**: You must have [pnpm](https://pnpm.io/installation) installed in your system.

```bash
    pnpm install
```

3. **Set environment variables**

Create a .env file at the root folder /app

```bash
FXRATES_API_KEY="<GET_YOUR_API_KEY>"
```

4. **Run the development server**

```bash
pnpm run dev
```

The app should now be running at http://localhost:3000

### Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your work: git commit -m "Add feature"
5. Push to the branch: `git push origin feature-name`
6. Create a Pull Request

### Join the BetterGovPh Community

- [Discord](https://discord.gg/RpYZyCupuj)
- [Facebook](https://www.facebook.com/bettergovph)
