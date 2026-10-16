URL = https://raw.githubusercontent.com/XenonPPG/gourd/refs/heads/master/docs/swagger.json
DOC_FILE = swagger_temp.json
DOC_PATH = tmp/$(DOC_FILE)

generate-api:
	curl -fSL --create-dirs -o $(DOC_PATH) $(URL)
	npx swagger-typescript-api generate -p $(DOC_PATH) -o ./src/api/gen

.PHONY: generate-api