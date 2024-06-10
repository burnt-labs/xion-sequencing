# xion-sequencing

When encountered in the wild, swarms of Nonce mismatches are known to ruin your day.

This repository proposes a few Scuffed strategies, which help us get on with the rest of it. NB; keyword: Scuffed.
Secure, scalable and sequential implementation of these examples are left as an exercise to you, dear reader.

Wise man once said: "There's more than one way to do it"

---

## Getting started

- In this repo, you'll find Golang, Python, Rust and Typescript examples of how to enqeue messages for asynchronous processing.
- Here are a few one-liners to help get you set up; jump to the next section when you're satisfied with your local env.
```bash
$ brew install --cask docker
$ brew install go 
$ brew install python
$ brew install rustup-init && rustup-init && rustup toolchain install stable
$ brew install node yarn pnpm
```

## Work in progress

- These examples provide basic async processing of messages in each language.
- We plan on providing examples for more brokers in ach language.
- The Typescript codebase provides a full Cosmos / Xion example with on-chain interaction.
- We will be adding on-chain interaction for the other languages over time.

## Running the examples

- Bring up the Docker containers, as needed.

```bash
$ docker compose up redis
$ docker compose up aws
```

- All examples are runnable from Makefile targets at the repo root.

```bash
$ make go-aws-sqs
$ make go-memory
$ make go-redis
$ make py-aws-sqs
$ make py-memory
$ make py-redis
$ make rs-aws-sqs
$ make rs-memory
$ make rs-redis
$ make ts-aws-sqs
$ make ts-memory
$ make ts-redis
```
