## Makefile
.PHONY: build
build:
	@echo "Building site..."
	pnpm run build
	@echo "Finished started!"

.PHONY: deploy
deploy:
	@echo "Deploy hosting to netlify"
	pnpm run build	
	ntl deploy --prod	

.PHONY: start
start:
	@echo "start web app"
	pnpm run dev


.PHONY: add
add:	
	@echo "push to git\n" 
	git add . 
	@echo "update\n" 
	git commit -m '$(comment)' 
	@echo "push to main\n" 
	git push origin main 
	
.PHONY: push
push:
	@echo "push"
	git push origin main
