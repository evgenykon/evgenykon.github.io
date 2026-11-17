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

- **`/`** — hero + blog feed (16 posts) + CV switcher
- **`/blog/<date>`** — post page, prose layout, prev/next navigation
- **`/experience/`** — fullstack CV
- **`/experience-front/`** — frontend CV
- **`/experience-back/`** — backend CV
- **`/404`** — "off the trail"

## The snow scene

On screens ≥ 960px the blog feed becomes a scroll scene:

- cards ride up the left track, one post per screen;
- on the right lane a top-down snowboarder works the slope — the trail dashes, gate markers and snowfall move with the scroll;
- between every second pair of posts the rider throws a trick: **360, backflip, indy grab, method, rodeo 720**, with a label and snow spray;
- a HUD at the bottom shows the current post index and progress.

Driven by one `requestAnimationFrame` loop over `getBoundingClientRect()` — no animation libraries.

On mobile (or with `prefers-reduced-motion: reduce`) the scene is skipped entirely: the same cards render as a normal grid with an IntersectionObserver fade-in. The JS restores layout when the viewport crosses the breakpoint.

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
