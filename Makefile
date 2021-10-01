
.PHONY: install
install:
	yarn set version berry &&	yarn set version latest
	yarn install

.PHONY: db.build
db.build:
	cd db && docker build -t platezero/db .

.PHONY: db.run
db.run: db.build
	-docker run --rm -d -p 5432:5432 -e POSTGRES_PASSWORD=password --name platezero-db platezero/db

.PHONY: db.test
db.test: db.stop db.build 
	docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=password platezero/db

.PHONY: db.stop
db.stop:
	-docker stop platezero-db

.PHONY: graphql
graphql: db.stop db.run
	DEBUG=graphile-build:warn npx postgraphile \
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
