DOCKER_IMAGE = openmaraude/console
DOCKER_PORT = 3000:80
RELEASE ?= latest

run: run_local

run_%: build
	@echo ">>> Run $* version"
	docker run --rm -ti -p ${DOCKER_PORT} -e BUILD=$* ${DOCKER_IMAGE}

graphs:
	make -C public/images/doc

build: graphs
	docker build -t ${DOCKER_IMAGE} .

shell: build
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE} bash

release: graphs
	docker build -t ${DOCKER_IMAGE}:${RELEASE} .
	docker push ${DOCKER_IMAGE}:${RELEASE}

tag:
	git tag $(shell printf "$$(date '+%Y%m%d')-%03d" $$(($$(git tag --list "$$(date '+%Y%m%d')-*" --sort -version:refname | head -1 | awk -F- '{print $$2}')+1)))
