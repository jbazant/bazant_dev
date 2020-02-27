#!/bin/sh

# lint project
yarn run lint
if [[ $? -ne 0 ]]; then
  echo "FATAL: lint error" >&2
  echo "       Blocking push" >&2
  exit 1
fi

## run all tests
#yarn run test
#if [[ $? -ne 0 ]]; then
#  echo "FATAL: test error}" >&2
#  echo "       Blocking push" >&2
#  exit 2
#fi