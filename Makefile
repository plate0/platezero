
.PHONY: db.build
db.build:
	cd db && docker build -t platezero/db .


.PHONY: db.run
db.run: db.build
	-docker run --rm -d -p 5432:5432 -e POSTGRES_PASSWORD=password --name platezero-db platezero/db


.PHONY: graphql
graphql: db.run
	npx postgraphile \
		-c postgres://postgres:password@localhost/postgres \
		--watch \
		--enhance-graphiql \
		--dynamic-json \
		--cors \
		--schema pz_public \
		--default-role pz_anonymous \
		--jwt-secret supersecret \
		--jwt-token-identifier pz_public.jwt_token \
		--default-role pz_anonymous
