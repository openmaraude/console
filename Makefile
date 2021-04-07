DOCKER_IMAGE = openmaraude/console
DOCKER_PORT = 3000:80

run: run_local

run_%: build
	@echo ">>> Run $* version"
	docker run --rm -ti -p ${DOCKER_PORT} -e BUILD=$* ${DOCKER_IMAGE}

build:
	docker build -t ${DOCKER_IMAGE} .

shell: build
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE} bash

release:
	docker build -t ${DOCKER_IMAGE}:latest .
	docker push ${DOCKER_IMAGE}:latest

tag:
	git tag $(shell printf "$$(date '+%Y%m%d')-%03d" $$(($$(git tag --list "$$(date '+%Y%m%d')-*" --sort -version:refname | head -1 | awk -F- '{print $$2}')+1)))
