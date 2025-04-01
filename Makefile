## Makefile
.PHONY: build
build:
	@echo "Building site..."
	pnpm build
	@echo "Finished started!"

.PHONY: deploy
deploy:
	@echo "Deploy hosting to netlify"
	pnpm build	
	ntl deploy --prod --dir=dist

.PHONY: start
start:
	@echo "start web app"
	pnpm dev

.PHONY: add
add:	
	@echo "push to git\n" 
	git add . 
	@echo "update\n" 
	git commit -m '$(comment)' 
	@echo "push to main\n" 
	git push origin blog-1 
	
.PHONY: push
push:
	@echo "push"
	git push origin main
