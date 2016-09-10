.PHONY: build
build:
	tsc ./src/*.ts -outDir ./lib

.PHONY: watch
watch:
	tsc --watch ./src/*.ts -outDir ./lib

.PHONY: check
check:
	tape ./test/*.js

