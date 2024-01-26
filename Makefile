### To build project from zero:

#1. build images
build-images:
	docker compose build

#2. build project
build-project:
	rm -rf ./node_modules && docker compose run --rm gridsome bash -c "export NODE_OPTIONS=--openssl-legacy-provider && yarn install && yarn build"

#3. up containers
up:
	docker compose up -d

down:
	docker compose down

dev:
	docker-compose run -p "13200:8080"  --rm gridsome bash -c "export NODE_OPTIONS=--openssl-legacy-provider && yarn run develop"

cmd:
	docker-compose run builder bash