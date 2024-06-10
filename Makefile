#
# Golang
#
go-aws-sqs:
	docker compose up -d aws
	cd golang/aws-sqs && go run main.go
go-memory:
	cd golang/memory && go run main.go
go-redis:
	docker compose up -d redis
	cd golang/redis && go run main.go

#
# Python
#
py-aws-sqs:
	docker compose up -d aws
	cd python/aws-sqs && python3 main.py
py-memory:
	cd python/memory && python3 main.py
py-redis:
	docker compose up -d redis
	cd python/redis && python3 main.py

#
# Rust
#
rs-aws-sqs:
	docker compose up -d aws
	cd rust/aws-sqs && cargo run
rs-memory:
	cd rust/memory && cargo run
rs-redis:
	docker compose up -d redis
	cd rust/redis && cargo run

#
# Typescript
#
ts-aws-sqs:
	docker compose up -d aws
	cd typescript/aws-sqs && yarn start
ts-memory:
	cd typescript/memory && yarn start
ts-redis:
	docker compose up -d redis
	cd typescript/memory && yarn start
