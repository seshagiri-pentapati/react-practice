# React Practice

Consolidated React learning demos in a single Vite + React 18 app. Merged from 9 individual React practice projects.

## Demos

| Route | Demo | What It Demonstrates |
|-------|------|---------------------|
| `/` | Home | Navigation page listing all demos |
| `/age-finder` | Age Finder | Birthday age calculator with celebration graphic (from `agefinder`) |
| `/context-demo` | Context API Demo | Theme (dark/light) and language context with localStorage (from `react-context-basic`) |
| `/use-reducer-demo` | useReducer Demo | Fetch random user data with useReducer state management (from `useReducer-basic`) |
| `/job-portal` | Job Portal | Job board with add, edit, and delete (from `job-portal`) |
| `/job-tracker` | Job Tracker | Dashboard with sidebar, dark mode toggle, and routing (from `jobTracker`) |
| `/team-avengers` | Team Avengers | Avengers squad builder with stats using useReducer + context (from `teamavengers`) |

## Tech Stack

- **React 18** + React DOM
- **Vite 5** (build tool)
- **React Router 6** (routing)
- **TypeScript 5** (strict mode)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |

## Project History

This project consolidates 9 former standalone practice projects:

- `agefinder` — React 17 age calculator (CRA)
- `react-context-basic` — React 18 context API demo (CRA)
- `useReducer-basic` — React 18 useReducer demo (CRA)
- `job-portal` — React 18 job board (Vite)
- `jobTracker` — React 18 job tracking dashboard (Vite)
- `teamavengers` — React 17 + Redux avengers app (CRA)
- `seshu-react-guide` — React learning guide with Redux Toolkit
- `react-mfe-concept` — Webpack Module Federation micro-frontend demo
- `react-with-typescript` — React + TypeScript course code

The original projects were merged into route-based demos here.

## Included Guide Websites

| Folder | Topic |
|--------|-------|
| interview-prep-for-slot-gaming-frontend-developer/ | Slot gaming frontend developer interview prep (Next.js) |
| seshu-react-interview-prep-guide-website/ | React interview preparation guide (Next.js) |

These are standalone Next.js content sites � run 
pm install && npm run dev inside each folder.
