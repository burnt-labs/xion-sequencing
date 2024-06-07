#
# Golang
#
golang-memory:
	cd golang/memory && go run main.go
golang-redis:
	cd golang/redis && go run main.go

#
# Python
#
python-memory:
	cd python/memory && python3 main.py
python-redis:
	cd python/redis && python3 main.py

#
# Rust
#
rust-memory:
	cd rust/memory && cargo run
rust-redis:
	cd rust/redis && cargo run

#
# Typescript
#
typescript-memory:
	cd typescript/memory && yarn start
typescript-redis:
	cd typescript/memory && yarn start
