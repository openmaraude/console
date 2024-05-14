DOCKER_IMAGE = openmaraude/console
DOCKER_PORT = 3000:3000
RELEASE ?= latest

run:
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE}

graphs:
	make -C public/images/doc

build: graphs
ifndef SENTRY_AUTH_TOKEN
	@echo "	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" >&2
	@echo "	! WARNING, SENTRY_AUTH_TOKEN IS NOT SET !" >&2
	@echo "	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" >&2
endif
	docker build --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} --build-arg MAPBOX_TOKEN=${MAPBOX_TOKEN} -t ${DOCKER_IMAGE}:${RELEASE} .

shell: build
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE}:${RELEASE} bash

release: graphs build
	docker push ${DOCKER_IMAGE}:${RELEASE}

tag:
	git tag $(shell printf "$$(date '+%Y%m%d')-%03d" $$(($$(git tag --list "$$(date '+%Y%m%d')-*" --sort -version:refname | head -1 | awk -F- '{print $$2}')+1)))
