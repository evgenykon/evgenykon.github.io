# Evgeny.Kon page

## Setup dev

1. Install with docker compose
```
make build-images
make dev
```
2. Open in browser

http://localhost:13200/

## Deploy to Github

1. Commit & push & switch to master
2. run `make deploy`
3. gh-pages build static files and commit it to own branch 'gh-pages'
4. Look at https://github.com/evgenykon/evgenykon.github.io/settings/pages branch should be `gh-pages`
5. Wait few minutes