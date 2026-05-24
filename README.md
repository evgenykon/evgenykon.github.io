# Evgeny.Kon page

Personal portfolio, blog & CV site built with [Gridsome](https://gridsome.org/) (Vue 2 + GraphQL), [Buefy](https://buefy.org/) / [Bulma](https://bulma.io/), and [Remark](https://remark.js.org/). Hosted on [GitHub Pages](https://pages.github.com/).

## Tech Stack

| Tool | Purpose |
|---|---|
| **Gridsome v0.7** | Vue-based static site generator |
| **Vue 2** | Frontend framework |
| **Buefy / Bulma** | UI components & CSS framework |
| **GraphQL** | Gridsome data layer (page-query / static-query) |
| **Remark** | Markdown → HTML transformer |
| **Moment.js** | Date formatting |
| **Docker** | Containerized dev environment |
| **gh-pages** | Deploy to GitHub Pages |
| **Yandex Metrica** | Web analytics |

## Pages

- **`/`** — Blog homepage with post list (7 posts, Jul 2022 – Dec 2023)
- **`/experience/`** — Fullstack CV (Senior Full-Stack / Tech Lead)
- **`/experience-front/`** — Frontend-focused CV
- **`/experience-back/`** — Backend-focused CV
- **`/demos/allow-list`** — URL availability checker tool

## Content

All content lives in Markdown files under `docs/` with YAML frontmatter:

- `docs/main.md` — homepage text & blog title
- `docs/blog/*.md` — blog posts
- `docs/cv/fullstack.md`, `frontend.md`, `backend.md` — CV data

## Development

### With Docker (recommended)

```bash
make build-images
make dev
# → http://localhost:13200/
```

### Without Docker

Requires Node.js 16–17.

```bash
yarn install
yarn develop
# → http://localhost:8080/
```

## Production build

```bash
yarn build       # → dist/
```

## Deploy to GitHub Pages

```bash
make deploy      # or: npm run deploy
```

Pushes `dist/` to the `gh-pages` branch. The GitHub Pages setting must point to `gh-pages`.
