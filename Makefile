DOCKER_IMAGE = openmaraude/console
DOCKER_PORT = 3000:3000

API_TAXI_PUBLIC_URL_PROD = https://api.taxi
API_TAXI_PUBLIC_URL_DEV = https://dev.api.taxi

run: run_local

run_%: API_TAXI_PUBLIC_URL=${API_TAXI_PUBLIC_URL_$(shell echo $* | tr '[:lower:]' '[:upper:]')}
run_%: build
	@echo ">>> Run $* version"
	docker run --rm -ti -p ${DOCKER_PORT} -e API_TAXI_PUBLIC_URL=${API_TAXI_PUBLIC_URL} ${DOCKER_IMAGE}

build:
	docker build -t ${DOCKER_IMAGE} .

shell: build
	docker run --rm -ti -p ${DOCKER_PORT} ${DOCKER_IMAGE} bash

release:
	docker build -t ${DOCKER_IMAGE}:latest .
	docker push ${DOCKER_IMAGE}:latest

tag:
	git tag $(shell printf "$$(date '+%Y%m%d')-%03d" $$(($$(git tag --list "$$(date '+%Y%m%d')-*" --sort -version:refname | head -1 | awk -F- '{print $$2}')+1)))
