#!/bin/bash

SEMTAG='./tools/semtag'
ACTION=${1:-patch}
# If true it will add the user prefix, e.g. 1.0.0 -> v1.0.0 or v1.0.0 -> v1.0.0
V_PREFIX=${2:-false}

git fetch origin --tags

RELEASE_VERSION="$($SEMTAG final -s $ACTION -o)"

if [ "$V_PREFIX" = false ]; then
  # shellcheck disable=SC2001
  RELEASE_VERSION=$(echo "$RELEASE_VERSION" | sed 's/v//g')
fi

echo "Next release version: $RELEASE_VERSION"

npm version "$RELEASE_VERSION" -no-git-tag-version
git commit -m "chore: bump version to $RELEASE_VERSION" -a
git push origin master

$SEMTAG final -s $ACTION -v "$RELEASE_VERSION"
