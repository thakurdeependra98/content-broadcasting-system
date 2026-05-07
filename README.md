# Content Broadcasting System (Frontend)

Educational Content Broadcasting System built with React and Vite. Teachers upload scheduled media, principals approve/reject, and students view live broadcasts on a public route (`/live/:teacherId`).

This project uses a mock-data-only backend (localStorage). The mock adapter and service layer are intentionally kept so the app can be run and evaluated without a real server.

## Current status

- Key implemented features:
	- Pagination for `PendingApprovals` and teacher `MyContent` (client-side)
	- Newest-first ordering for pending approvals
	- Exposed mock data persisted in `localStorage` (key `cbs_db_v1`)
	- Dark mode with theme persistence and dark-mode background variants for both authenticated and public layouts
	- Drag-and-drop file upload with preview in the upload form
	- TanStack Query integration (`@tanstack/react-query`) for data fetching, polling, and cache invalidation
	- Polling for live page content via React Query `refetchInterval`
	- Protected routes and role-based guards in the UI

- Partially implemented / needs polish:
	- Skeleton loaders and some reusable components exist but could be extended
	- Accessibility and keyboard support for drag-and-drop and toggles need improvement

- Not implemented (optional for this interview):
	- Automated test suite (unit + e2e)
	- Persisting pagination state in URL query params

## Tech stack

- React 19, Vite
- Tailwind CSS 3
- React Router 7
- React Query (`@tanstack/react-query`)
- Axios, React Hook Form, Zod

## Setup & run

Install and run the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Demo accounts

- Principal: `principal@demo.com` / `principal123`
- Teacher: `teacher@demo.com` / `teacher123`

## Mock data & inspection

- Demo data is seeded into `localStorage` under the key `cbs_db_v1`.
- To inspect pending items in the browser console:

```js
const db = JSON.parse(localStorage.getItem('cbs_db_v1') || '{}')
(db.content || []).filter(c => c.status === 'pending').slice(0,20)
```

## Files of interest

- `src/services/mockBackend.js` — mock data layer using `localStorage`
- `src/hooks/usePendingList.js` — pending approvals query (React Query)
- `src/pages/principal/PendingApprovals.jsx` — pending approvals UI + pagination
- `src/pages/teacher/MyContent.jsx` — teacher content list + pagination
- `src/components/forms/UploadContentForm.jsx` — drag-and-drop upload
- `src/components/layouts/AppLayout.jsx` and `src/components/layouts/PublicLayout.jsx` — dark-mode backgrounds and theme toggle

## Recommended next steps (if you want to improve the interview submission)

1. Add a small test suite: unit tests for key hooks (`useMyContentList`, `usePendingList`) and one e2e flow (login → upload → approve).
2. Persist pagination state to URL query params for better reproducibility when sharing links.
3. Improve accessibility for drag-and-drop and keyboard navigation for the theme toggle.

## Notes for reviewers

- The app initializes theme before React mounts to avoid flash-of-light — see `src/main.jsx`.
- React Query keys and invalidation are set up so replacing the mock layer with a real API later is straightforward.

For more architecture details and assumptions, see [Frontend-notes.txt](Frontend-notes.txt).
