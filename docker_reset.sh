#!/bin/bash

# Project name from compose.yaml
PROJECT_NAME="portfolio"

echo "Stopping and removing containers for project: $PROJECT_NAME"
docker compose down -v

echo "Removing images built for this project..."
# Remove images that match the project name pattern (portfolio-*)
IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "^${PROJECT_NAME}-" || true)
if [ -n "$IMAGES" ]; then
  echo "$IMAGES" | xargs docker rmi -f
else
  echo "No images found for this project."
fi

echo "Removing volumes created by this project..."
# Remove volumes that match the project name pattern (portfolio_*)
VOLUMES=$(docker volume ls --format "{{.Name}}" | grep "^${PROJECT_NAME}_" || true)
if [ -n "$VOLUMES" ]; then
  echo "$VOLUMES" | xargs docker volume rm
else
  echo "No volumes found for this project."
fi

echo "Removing networks created by this project..."
# Remove networks that match the project name pattern (portfolio_* or portfolio-*)
NETWORKS=$(docker network ls --format "{{.Name}}" | grep -E "^${PROJECT_NAME}_|^${PROJECT_NAME}-" || true)
if [ -n "$NETWORKS" ]; then
  echo "$NETWORKS" | xargs docker network rm
else
  echo "No networks found for this project."
fi

echo "Reset complete! All resources for project '$PROJECT_NAME' have been removed."