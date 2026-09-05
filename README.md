# 📈 Stock Predictor

A real-time stock analysis and prediction dashboard built with **React 19 + Vite + TypeScript + Tailwind CSS 4**. All market data is fetched live from Yahoo Finance through a small Express/Vercel-serverless proxy — no fabricated numbers anywhere in the UI.

![Tech](https://img.shields.io/badge/React-19-blue) ![Tech](https://img.shields.io/badge/Vite-6-purple) ![Tech](https://img.shields.io/badge/TypeScript-5-blue) ![Tech](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

- **Core Prediction Matrix** — probability of rise/dip with target price windows, driven by real market data (no simulated sentiment)
- **Technical Checklist** — 9 EMA trend, RSI momentum, volume surge vs 10-day average, volatility context, price vs SMA50, each with transparent scoring contributions
- **Live Price Chart** — intraday to ALL timeframes (`1D / 5D / 1M / 6M / YTD / 1Y / 5Y / ALL`) with 9 EMA, 20 EMA, 50 SMA, 200 SMA, and volume bars
- **Company Fundamentals** — valuation multiples, profitability margins, growth, financial health, analyst consensus targets from Yahoo `quoteSummary`
- **Watchlist Rankings** — cross-sectional z-score ranking across your list combining technical (45%), fundamental (35%), and options-flow (20%) signals; missing categories are excluded and weights renormalized
- **Options Snapshot** — ATM implied volatility and put/call open-interest skew per ticker
- **Live Market News** — real headlines for the active ticker via Yahoo search
- **Multi-language UI** — English, 简体中文, Español, 日本語, Français, Deutsch, plus user-defined custom languages
- **Currency Display** — view prices converted across popular currencies

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start both servers (proxy on :3005, Vite dev server on :3000)
npm run dev
```

Then open **http://localhost:3000**.

> No API keys are required. All data flows through the local Yahoo Finance proxy.

### Other Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run Express proxy (`tsx server.js`) + Vite dev server together |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build (proxies `/api/yahoo` to `:3005`) |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove build output and dev server |

## 🏗️ Architecture

```
┌──────────────┐   /api/yahoo/*   ┌────────────────┐   upstream    ┌───────────────┐
│  React SPA   │ ───────────────▶ │ Express (dev)  │ ────────────▶ │ Yahoo Finance │
│ (Vite :3000) │                  │ or Vercel fns  │               │ query1/query2 │
└──────────────┘                  └────────────────┘               └───────────────┘
```

- **Development**: Vite proxies `/api/yahoo/*` to the Express server (`server.js`, port 3005).
- **Production**: equivalent logic runs as Vercel Serverless Functions in `api/yahoo/**`.
- Both share one module (`api/_lib/yahoo.ts`) so behavior cannot drift between environments. It handles Yahoo's cookie + crumb handshake for authenticated endpoints and edge caching headers.

### Proxy Endpoints

| Endpoint | Purpose | Auth |
| --- | --- | --- |
| `/api/yahoo/chart/:symbol` | OHLCV series for any range/interval | none |
| `/api/yahoo/fundamentals/:symbol` | Valuation, margins, health, analyst targets | cookie+crumb |
| `/api/yahoo/news/:symbol` | Latest headlines | none |
| `/api/yahoo/options/:symbol` | Options chains → IV & put/call ratios | cookie+crumb |

## 📁 Project Structure

```
├── api/                  # Serverless functions + shared Yahoo client
│   ├── _lib/yahoo.ts     # Cookie/crumb handshake, fetchers, caching
│   └── yahoo/*/          # chart / fundamentals / news / options handlers
├── server.js             # Express wrapper for local development
├── src/
│   ├── components/       # Panels: prediction card, checklist, chart,
│   │                     # fundamentals, rankings, news, settings...
│   ├── data/             # Fetch + parse layer (one module per source)
│   ├── utils/            # Technical analysis engine, ranking math,
│   │                     # translations (6 built-in languages)
│   └── types.ts          # Shared domain types
└── vite.config.ts        # Dev/preview proxy config
```

## ⚠️ Disclaimer

This app is for **informational and educational purposes only**. Predictions are statistical estimates from public market data — not investment advice. Always do your own research before trading.

