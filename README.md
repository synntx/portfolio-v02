# synntx.com

Harsh's site. One static page whose colours follow the real sun over India.

## How it is built

A small Go program in `cmd/build` turns `site/` into `dist/`:

- `site/content.json` holds every word on the page. The build checks it strictly: dates, ids, links, one current job, no em dashes.
- `site/templates` render that content into one HTML page, including each job's chapters.
- `site/scripts` is TypeScript for behaviour only: the theme set before first paint (`head.ts`), the sun control, the Work dialog and its dial.
- `site/styles` is plain CSS.

esbuild's Go library bundles and minifies the scripts and styles, and both are inlined into `index.html`. Files in `site/public` are copied as they are.

## Commands

```sh
go run ./cmd/build -serve :4321   # rebuild on every page load at http://localhost:4321
go run ./cmd/build                # write dist/
npm install && npm run typecheck  # type-check site/scripts
```

## Deploy

Vercel runs `go run ./cmd/build -analytics` and serves `dist/` (see `vercel.json`). The `-analytics` flag adds Vercel Web Analytics and Google Analytics, loaded after the page.
