DOCKER_IMAGE = openmaraude/console
DOCKER_IMAGE_DEVENV = openmaraude/console-devenv
DOCKER_PORT = 3000:80
RELEASE ?= latest

run: run_local

run_%: build
	@echo ">>> Run $* version"
	docker run --rm -ti -p ${DOCKER_PORT} -e BUILD=$* ${DOCKER_IMAGE}

graphs:
	make -C public/images/doc

build: graphs
ifndef SENTRY_AUTH_TOKEN
	@echo "	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" >&2
	@echo "	! WARNING, SENTRY_AUTH_TOKEN IS NOT SET !" >&2
	@echo "	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" >&2
endif
	docker build --target devenv -t ${DOCKER_IMAGE_DEVENV}:${RELEASE} .
	docker build --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} -t ${DOCKER_IMAGE}:${RELEASE} .

shell: build
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE}:${RELEASE} bash

release: graphs build
	docker push ${DOCKER_IMAGE_DEVENV}:${RELEASE}
	docker push ${DOCKER_IMAGE}:${RELEASE}

tag:
	git tag $(shell printf "$$(date '+%Y%m%d')-%03d" $$(($$(git tag --list "$$(date '+%Y%m%d')-*" --sort -version:refname | head -1 | awk -F- '{print $$2}')+1)))
