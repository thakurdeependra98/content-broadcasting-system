# Content Broadcasting System (Frontend)

Educational **Content Broadcasting System** built with **React 19** and **Vite**. Teachers upload subject-based media with a schedule; principals approve or reject; students view the **live** broadcast for a teacher on a public route (`/live/:teacherId`).

There is **no real backend** in this repo: all data is stored in **localStorage** behind a **replaceable Axios + service layer** (see [Frontend-notes.txt](Frontend-notes.txt)).

## Tech stack

- React 19, Vite 8, React Router 7
- Tailwind CSS 3, Radix UI primitives, shadcn-style components
- React Hook Form + Zod, Axios, Sonner toasts

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start dev server + HMR   |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint`  | ESLint                   |

## Demo accounts

| Role      | Email                 | Password      |
| --------- | --------------------- | ------------- |
| Principal | `principal@demo.com`  | `principal123` |
| Teacher   | `teacher@demo.com`    | `teacher123`   |
| Teacher 2 | `teacher2@demo.com`   | `teacher123`   |

## Public live page

- Example: [`/live/teacher-1`](http://localhost:5173/live/teacher-1) — no login required.
- Shows **approved** content whose **start/end window** contains “now”, with **10s polling**.

## Deployment

1. Run `npm run build`.
2. Deploy the `dist/` folder to any static host (Netlify, Vercel static, GitHub Pages, S3, etc.).
3. For SPA routing, configure the host to **rewrite all routes** to `index.html` (except static assets).

## Resetting demo data

Clear site data for the origin (or remove `localStorage` key `cbs_db_v1`) and refresh to re-seed ~600 demo content rows.

## Project notes

See **[Frontend-notes.txt](Frontend-notes.txt)** for architecture, auth flow, role routing, API approach, and assumptions.
