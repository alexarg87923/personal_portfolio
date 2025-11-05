#!/bin/bash
# Ensure logs directory exists
mkdir -p /home/alex/personal_portfolio/logs

# Stop and remove existing container if it exists (running or stopped)
CONTAINER_NAME="personal_portfolio_prod"
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1
    docker rm $CONTAINER_NAME > /dev/null 2>&1
fi

# Build and run with logs volume mounted for persistence
# Running in foreground so systemd can detect container exits and restart
docker build -t production .
docker run \
  --name $CONTAINER_NAME \
  -p 4000:4000 \
  -v /home/alex/personal_portfolio/logs:/app/logs \
  --rm \
  production
