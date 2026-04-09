### To build project from zero:

#1. build images
build-images:
	docker compose -f compose.dev.yaml build

#2. build project
build-project:
	rm -rf ./node_modules && docker compose -f compose.dev.yaml run --rm gridsome bash -c "export NODE_OPTIONS=--openssl-legacy-provider && yarn install && yarn build"

down:
	docker compose -f compose.dev.yaml down

dev-build:
	docker compose run --rm gridsome bash -c "export NODE_OPTIONS=--openssl-legacy-provider && yarn install"

dev:
	docker compose run -p "13200:8080"  --rm gridsome bash -c "export NODE_OPTIONS=--openssl-legacy-provider && yarn run develop"

cmd:
	docker compose run builder bash