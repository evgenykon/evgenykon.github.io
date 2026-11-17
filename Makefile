### Astro site — dev / build / deploy

# 1. build image
build-images:
	docker compose -f compose.dev.yaml build

# 2. dev server → http://localhost:13201/
dev:
	docker compose -f compose.dev.yaml up

dev-bg:
	docker compose -f compose.dev.yaml up -d

# production build → dist/
build:
	docker compose -f compose.dev.yaml run --rm web npm run build

# host-local development (node >= 20)
local-dev:
	npm install && npm run dev

preview:
	docker compose -f compose.dev.yaml run --rm -p "13201:4321" web npm run preview

down:
	docker compose -f compose.dev.yaml down

# deploy dist/ to the gh-pages branch
deploy: build
	npx gh-pages -f -d dist

.PHONY: build-images dev dev-bg build local-dev preview down deploy
