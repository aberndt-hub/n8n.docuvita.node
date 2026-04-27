#!/bin/bash

set -e

PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$PACKAGE_NAME" ]; then
  echo "Error: Could not determine package name from package.json"
  exit 1
fi

echo "Detected package name: $PACKAGE_NAME"

echo "Building package..."
pnpm run build

echo "Removing old package from container..."
docker exec --user root n8n rm -rf "/home/node/.n8n/custom/$PACKAGE_NAME"

echo "Copying dist/ to container..."
docker cp "./dist" "n8n:/home/node/.n8n/custom/$PACKAGE_NAME"

echo "Restarting n8n service..."
docker container restart n8n
docker logs -f n8n
