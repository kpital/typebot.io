#!/usr/bin/env bash
set -euo pipefail

# Builds typebot-builder and typebot-viewer images for the target platform
# and pushes them to Docker Hub, so other machines only need to `pull`.

DOCKERHUB_USER="${DOCKERHUB_USER:-roylansk}"
PLATFORM="${PLATFORM:-linux/amd64}"
TAG="${TAG:-latest}"

cd "$(dirname "$0")/.."

echo "==> Building typebot-builder ($PLATFORM)"
docker buildx build --platform "$PLATFORM" \
  --build-arg SCOPE=builder \
  -t "$DOCKERHUB_USER/typebot-builder-kpital:$TAG" \
  --push .

echo "==> Building typebot-viewer ($PLATFORM)"
docker buildx build --platform "$PLATFORM" \
  --build-arg SCOPE=viewer \
  -t "$DOCKERHUB_USER/typebot-viewer-kpital:$TAG" \
  --push .

echo "==> Done. Images pushed:"
echo "    $DOCKERHUB_USER/typebot-builder-kpital:$TAG"
echo "    $DOCKERHUB_USER/typebot-viewer-kpital:$TAG"
