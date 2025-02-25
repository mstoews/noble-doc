## Makefile
build:
	@echo "Building site..."
	pnpm run build
	@echo "Finished started!"

deploy:
	@echo "Deploy hosting to netlify"
	pnpm run build	
	ntl deploy --prod	

start:
	@echo "start web app"
	pnpm run dev

add:
	@echo "push to git"
	git add .
	@echo "update"
	git commit -m 'update repository'
	@echo "push"
	git push origin main

push:
	@echo "push"
	git push origin main
