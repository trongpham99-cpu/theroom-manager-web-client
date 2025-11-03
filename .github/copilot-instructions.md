<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this repository -->
# Copilot / Agent instructions — theroom-manager-web-client

This file captures the minimal, actionable facts an AI coding assistant needs to be productive in this repository.

1) Big picture (what this project is)
- Single-page React app scaffolded from the Fuse React Vite template. Uses Vite + TypeScript + React 19.
- Main app entry: `src/index.tsx`. The app is wrapped by many Fuse providers in `src/app/App.tsx` (themes, i18n, auth, dialogs, navigation, react-query).
- Routing: `src/configs/routesConfig.tsx` dynamically imports route modules from `src/app/**` using `import.meta.glob`. Add route files under `src/app/**` so they'll be auto-discovered.

2) Where to change behavior (key files)
- App wiring & providers: `src/app/App.tsx` — add global providers or change provider order here.
- Routes discovery: `src/configs/routesConfig.tsx` — routes loaded from `/src/app/**/*Route.tsx` and `/src/app/**/route.tsx` via `import.meta.glob`.
- API client & env: `src/utils/api.ts` — uses VITE_API_BASE_URL and VITE_PORT; exports `API_BASE_URL` used by MSW and network calls.
- Feature modules: place components/pages under `src/app/(control-panel)` or `src/app/(public)` to match existing structure.

3) Important patterns and conventions to follow
- Import aliases are configured in `tsconfig.json` (examples: `@fuse/*`, `@i18n/*`, `@mock-utils/*`, `@/*`). Use these aliases rather than relative paths.
- Route file naming: create either `*Route.tsx` (named route config objects) or `route.tsx` inside a feature folder — both are picked up by `routesConfig.tsx`.
- Mock API: MSW is enabled. `public/mockServiceWorker.js` is used and started from `src/index.tsx` via `worker.start({ serviceWorker: { url: `${API_BASE_URL}/mockServiceWorker.js` } })`. Respect `API_BASE_URL` when referencing mock assets.
- Type checks at build: `npm run build` runs `tsc` (type check) before `vite build`. When changing types or tsconfig, expect type-check issues to block the build.

4) Running and debugging
- Development server (fast HMR): `npm run dev` (alias `npm start`).
- Build (type-check + bundle): `npm run build` — note this runs `tsc` first, then `vite build`.
- Preview artifact: `npm run preview`.
- Linting: `npm run lint` and `npm run lint:fix`. ESLint configuration at `eslint.config.mjs`.
- Node/npm requirements: package.json specifies engines Node >= 22.12.0 and npm >= 10.9.0 — CI/dev should match these.

5) Environment and MSW specifics
- Key env vars: VITE_API_BASE_URL (base URL used by `src/utils/api.ts`), VITE_PORT. In DEV mode `API_BASE_URL` is constructed to include the port.
- MSW files: `public/mockServiceWorker.js` and `src/@mock-utils/mswMockAdapter.ts` (the worker). `package.json` also sets msw.workerDirectory to `public`.

6) Auto-discovery & hot spots to inspect during PRs
- If a route fails to appear, check `src/app/**` for filenames matching `*Route.tsx` or `route.tsx`. Also confirm `import.meta.glob` pattern in `routesConfig.tsx`.
- When adding global context providers, update `src/app/App.tsx` — provider order matters (Auth -> Settings -> I18n -> Theme -> Layout etc.).

7) Small examples you can follow
- Add a new route: create `src/app/my-feature/myFeatureRoute.tsx` exporting a Fuse route config default. It will be auto-included by `routesConfig.tsx`.
- Read API base: `import { API_BASE_URL } from 'src/utils/api';` — used by index to locate MSW worker.

8) Files worth opening for context
- `package.json` (scripts & engines)
- `tsconfig.json` (path aliases)
- `src/index.tsx`, `src/app/App.tsx` (app bootstrap)
- `src/configs/routesConfig.tsx`, `src/configs/settingsConfig.ts` (routing & auth defaults)
- `src/utils/api.ts`, `public/mockServiceWorker.js`, `src/@mock-utils/mswMockAdapter.ts` (network & mocks)

9) Do not assume
- There are no generic server-side routes — this is an SPA. Do not add server-side-only expectations unless adding a backend integration.
- Route discovery is file-based. Do not add routes only in a central route list; follow the file-based pattern.

If anything here is unclear or you'd like more specific examples (example route file, sample provider change, or a quick PR template), tell me which area to expand. 
