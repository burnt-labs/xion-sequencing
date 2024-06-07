#
# Golang
#
golang-aws-sqs:
	cd golang/aws-sqs && go run main.go
golang-memory:
	cd golang/memory && go run main.go
golang-redis:
	cd golang/redis && go run main.go

#
# Python
#
python-aws-sqs:
	cd python/aws-sqs && python3 main.py
python-memory:
	cd python/memory && python3 main.py
python-redis:
	cd python/redis && python3 main.py

#
# Rust
#
rust-aws-sqs:
	cd rust/aws-sqs && cargo run
rust-memory:
	cd rust/memory && cargo run
rust-redis:
	cd rust/redis && cargo run

#
# Typescript
#
typescript-aws-sqs:
	cd typescript/aws-sqs && yarn start
typescript-memory:
	cd typescript/memory && yarn start
typescript-redis:
	cd typescript/memory && yarn start
