#!/bin/bash

# Skrypt do użycia w Vercel "Ignored Build Step"
# Blokuje automatyczne buildy dla main branch - build będzie wywoływany przez Deploy Hook z GitHub Actions

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  exit 0;
else
  exit 1;
fi

