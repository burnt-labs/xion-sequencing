#!/usr/bin/env bash
set -euxo pipefail

BASEDIR=$(dirname "$0")

create_deadletter_queue() {
    local Q="${1}"
    awslocal --endpoint-url=http://localhost:4566 sqs \
      create-queue \
      --queue-name "${Q}" \
      --attributes file://${BASEDIR}/dlq-attrs.json \
      --region "${AWS_REGION}"
}

create_source_queue() {
    local Q="${1}"
    awslocal --endpoint-url=http://localhost:4566 sqs \
      create-queue \
      --queue-name "${Q}" \
      --attributes file://${BASEDIR}/source-queue-attrs.json \
      --region "${AWS_REGION}"
}

# Make sure AWS_REGION is exported or set in this script
export AWS_REGION="us-east-1"

create_deadletter_queue "dead-letter-queue"
create_source_queue "queue"
