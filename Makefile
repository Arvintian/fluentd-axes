VERSION     = 1.0.7
PROJECT     = fluentd-axes

build:
	docker run --rm -ti -e WORKDIR=$(shell pwd) -e GOPATH=$(GOPATH) -v $(shell pwd):$(shell pwd) golang:1.11.0-alpine3.7 /bin/sh $(shell pwd)/build.sh
	python setup.py egg_info --egg-base /tmp sdist

package: build
	docker build -t $(PROJECT):$(VERSION) .

clean:
	rm -rf run.conf $(PROJECT) ./dist

image-clean:
	docker images | grep -E "($(PROJECT))" | awk '{print $$3}' | uniq | xargs -I {} docker rmi --force {}