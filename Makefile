.PHONY: help docs update-docs

CURRENT_VERSION := $(shell node scripts/current_version.js)
DOCS_DIR := ./docs/$(CURRENT_VERSION)

help:
	@echo 'Makefile for `ts-selector` package'
	@echo ''
	@echo 'Usage:'
	@echo '   make docs        	Generate the documentation in `docs/`'
	@echo '   make update-docs	Update latest version of `docs/`'
	@echo ''

docs:
	# Make sure `npm ci` is run.
	[ -d ./node_modules ] || npm ci

	rm -rf ${DOCS_DIR}

	# Generate new docs.
	./node_modules/.bin/typedoc \
	  --excludeNotExported \
	  --excludePrivate \
	  --readme none \
	  --mode file \
	  --out ${DOCS_DIR} \
	  ./src

	rm -fr ./docs/latest/
	cp -r $(DOCS_DIR) ./docs/latest/

	# Update `versions.json` in `docs`.
	node scripts/update_versions.js $(CURRENT_VERSION)