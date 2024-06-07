# xion-sequencing

In their natural environment, swarms of Nonce mismatches are known to ruin your day.

This repository proposes a few Scuffed strategies, the better get on with the rest of it. NB; keyword: Scuffed.
Secure, scalable and sequential implementation of the examples herein are left as an exercise to you, dear reader.

Wise man once said: "There's more than one way to do it"

---

## Getting started

- In this repo, you'll find Golang, Python, Rust and Typescript examples. You'll need one (or more) of these languages installed.

- Here are a few one-liners to help get you started; jump to the next section when you're satisfied with your local env.
```bash
$ brew install --cask docker
$ brew install go 
$ brew install python
$ brew install rustup-init && rustup-init && rustup toolchain install stable
$ brew install node yarn pnpm
```

## Running the examples

- Bring up the Docker containers, as needed.

```bash
$ docker compose up redis
```

- All examples are runnable from Makefile targets.

```bash
$ make golang-memory
$ make golang-redis
$ make python-memory
$ make python-redis
$ make rust-memory
$ make rust-redis
$ make typescript-memory
$ make typescript-redis
```
