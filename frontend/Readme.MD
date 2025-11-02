### Getting Started

1. Clone the Repository

```bash
git clone https://github.com/quin1sue/priceguidesph-bettergov.git
cd <your_directory>
cd frontend
```

2. **Install dependencies**
   **Note**: You must have [pnpm](https://pnpm.io/installation) installed in your system.

```bash
    pnpm install
```

3. **Set environment variables**

Create a .env file at the root folder /app
Get your API Key [here](https://fxratesapi.com/) for free.

```bash
NEXT_PUBLIC_FXRATES_API_KEY="<GET_YOUR_API_KEY>"
NEXT_PUBLIC_BACKEND_URL="<BACKEND_URL>"
```

4. **Run the development server**

```bash
pnpm run dev
```

### Folders

```bash
frontend/
├── public                   <- images/icons/banners
└── src                      <- main source directory/
    ├── app                  <- folder routes 
    ├── installation (route) <- installation page
    ├── about (route)        <- about page
    ├── [category]           <- indicator category page/
    │   └── [indicator]      <- nested dynamic route for specific indicator detail
    ├── components           <- reusable ui components/
    │   ├── custom           <- custom made components
    │   └── ui               <- shadcnUI components 
    ├── functions\types      <- type definitions 
    └── lib/
        ├── api              <- api functions fetch
        └── context          <- context providers/hooks
```
