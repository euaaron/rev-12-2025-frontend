# Cars

[![CI / Pages](../../actions/workflows/pages.yml/badge.svg)](../../actions/workflows/pages.yml)
[![Coverage](./coverage-badge.svg)](../../actions/workflows/pages.yml)

Lighthouse CI report (artifact): [download from the latest workflow run](../../actions/workflows/pages.yml), know that the result varies according to device, region and internet connection quality. Maybe you can get different results running Lighthouse yourself on a chromium browser like MS Edge or Google Chrome.

Small demo web app for browsing a list of cars with filtering, sorting, pagination, and a “New Car” form.

The UI talks to a GraphQL endpoint at `/graphql` via Apollo Client, but during local development it’s intercepted by Mock Service Worker (MSW) — so you can run the app without a real backend.

## Tech stack

Runtime / UI
- React: `^19.0.0`
- React DOM: `^19.0.0`
- TypeScript: `^5.7.2`
- Vite: `^6.0.3`

UI components
- Material UI (MUI): `@mui/material@7.1.1`
- MUI Icons: `^7.1.1`
- Emotion (styling): `@emotion/react@^11.14.0`, `@emotion/styled@^11.14.1`

Data / mocking
- Apollo Client: `@apollo/client@3.13.8`
- GraphQL: `graphql@16.11.0`
- Mock Service Worker: `msw@2.10.2`

Testing / quality
- Vitest: `^4.0.16` (+ coverage via `@vitest/coverage-v8@^4.0.16`)
- Testing Library: `@testing-library/react@^16.3.1`, `@testing-library/jest-dom@^6.9.1`, `@testing-library/user-event@^14.6.1`
- ESLint: `^9.16.0` (+ TypeScript ESLint `^8.17.0`)

Other
- UUID: `uuid@11.1.0`

## What the app does

On the main **Cars** screen you can:
- Browse a paged list of cars.
- Filter by **make**, **model**, **color**, and **year**.
- Sort by **make/model/year/color** and choose **ascending/descending**.
- Add a car via the **New Car** dialog.

Images are selected per device size (mobile/tablet/desktop) when present.

## How to use it

Prereqs:
- Node.js (recommended: current LTS)
- pnpm

Install deps:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Scripts

These are the available package scripts:

- `pnpm dev` — Starts the Vite dev server.
- `pnpm build` — Type-checks (`tsc`) and builds the production bundle (`vite build`).
- `pnpm build:mock` — Type-checks (`tsc`) and builds the production bundle with the mock folder content (`vite build --mode mock`)
- `pnpm preview` — Serves the production build locally (`vite preview`).
- `pnpm preview:mock` — Build and serves the mocked production build locally (`pnpm build:mock && vite preview`).

- `pnpm lint` — Lints the codebase with ESLint (fails on any warnings).
- `pnpm lint:fix` — Same as `lint`, but automatically fixes what it can.

- `pnpm test` — Runs Vitest in watch mode.
- `pnpm test:run` — Runs Vitest once (CI-friendly).
- `pnpm test:coverage` — Runs tests with coverage output in `coverage/`.
