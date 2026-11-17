# Evgeny.Kon page

Personal portfolio, blog & CV site. Rebuilt on **Astro 5** (static, zero-client-framework) with a dark-first design and a scroll-driven snowboard scene.

Live: https://evgenykon.github.io/

## Stack

| Tool | Purpose |
|---|---|
| **Astro 5** | Static site generator, content collections |
| **TypeScript** | Scene engine + site logic |
| **CSS custom properties** | Dark / light theme tokens |
| **Docker** | Containerized dev environment |
| **gh-pages / GitHub Actions** | Deploy to GitHub Pages |

No runtime framework ships to the browser — the page is HTML + CSS + two small scripts (theme toggle, snow scene).

## Pages

- **`/`** — compact intro band + the whole blog (all 16 posts, full text, one after another) + CV switcher
- **`/experience/`** — fullstack CV
- **`/experience-front/`** — frontend CV
- **`/experience-back/`** — backend CV
- **`/404`** — "off the trail"

There are no separate post pages: every article is rendered in full in the feed and addressable by anchor (`/#post-20261009`).

## The snow scene

On screens ≥ 900px the blog gets a sticky rider rail on the right:

- articles scroll past in a normal column, the rail stays pinned to the viewport;
- a top-down snowboarder rides the rail — trail dashes, gate markers and snowfall move with the scroll;
- each boundary between two articles is a `.post-gap`; when one crosses the rider's line the rider throws a trick: **360, backflip, indy grab, method, rodeo 720**, with a label and snow spray;
- the HUD at the bottom shows the current article index and overall progress.

Driven by one `requestAnimationFrame` loop over `getBoundingClientRect()` — no animation libraries, no scroll hijacking, no `prefers-reduced-motion` gating.

On mobile the rail is simply hidden and the articles flow as a normal single column.

## Content

Markdown lives in `src/content/`:

- `src/content/blog/*.md` — posts (`title`, `date`, `img` frontmatter)
- `src/content/cv/{fullstack,frontend,backend}.md` — CV data (frontmatter only)
- `src/data/site.ts` — hero texts

Images and PDFs are in `public/blog-photos/` and `public/pdf/`, referenced as `/blog-photos/...` and `/pdf/...`.

## Development

```bash
make build-images   # build the docker image
make dev            # → http://localhost:13201/
```

Without Docker (Node ≥ 20):

```bash
npm install
npm run dev         # → http://localhost:4321/
```

## Production build

```bash
make build          # → dist/ (inside docker)
# or
npm run build
```

## Deploy to GitHub Pages

```bash
make deploy         # builds and pushes dist/ to the gh-pages branch
```

Pages must point at the `gh-pages` branch (legacy mode). A GitHub Actions workflow
(`.github/workflows/deploy.yml`) is also provided — switch Pages → Source to
**GitHub Actions** to use it instead.

## Branches

- `master` — the old Gridsome (Vue 2) implementation, kept as a backup;
- `astro` — the Astro rewrite in this branch.
