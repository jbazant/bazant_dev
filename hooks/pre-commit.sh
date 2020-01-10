#!/bin/sh

# if no typescript files were modified exit with status 0
jsfiles=$(git diff --cached --name-only --diff-filter=ACM "*.ts" "*.tsx" | tr '\n' ' ')
[[ -z "$jsfiles" ]] && exit 0

# ts check
tsc --noEmit
if [[ $? -ne 0 ]]; then
  echo "FATAL: typescript error}" >&2
  echo "       Blocking commit" >&2
  exit 1
fi

# lint changes
echo "$jsfiles" | xargs eslint --fix
if [[ $? -ne 0 ]]; then
  echo "FATAL: lint error}" >&2
  echo "       Blocking commit" >&2
  exit 2
fi

# add back the modified files to staging
echo "$jsfiles" | xargs git add