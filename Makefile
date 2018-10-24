VERSION     = 1.1.0
PROJECT     = fluentd-axes

depend:
	dep ensure
	pip install -r requirements.txt
	cd ui && npm install && cd ..

build-ui:
	cd ui && npm run build && cd ..

build-apiserver:
	python setup.py egg_info --egg-base /tmp sdist

build: build-ui build-apiserver
	docker run --rm -ti -e WORKDIR=$(shell pwd) -e GOPATH=$(GOPATH) -v $(shell pwd):$(shell pwd) golang:1.11.0-alpine3.7 /bin/sh $(shell pwd)/build.sh

package: build
	docker build -t $(PROJECT):$(VERSION) .

clean:
	rm -rf run.conf $(PROJECT) ./dist ./static

image-clean:
	docker images | grep -E "($(PROJECT))" | awk '{print $$3}' | uniq | xargs -I {} docker rmi --force {}