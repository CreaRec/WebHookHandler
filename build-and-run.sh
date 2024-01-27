#!/bin/bash

# Define your app name and image name
APP_NAME="webhook-handler-app"
IMAGE_NAME="webhook-handler-app-image"

# Stop the running container (if it exists)
if docker ps -a --filter "name=$APP_NAME" --format '{{.Names}}' | grep -q $APP_NAME; then
  echo "Stopping and removing the running container..."
  docker stop $APP_NAME
  docker rm $APP_NAME
  echo "Stopping and removing the running container... - Done."
fi

# Build the Docker image
docker build -t $IMAGE_NAME .

# Run the Docker container
docker run -d -p 3000:3000 --name --restart unless-stopped $APP_NAME $IMAGE_NAME

# Remove all unused images and data
docker system prune -af

echo "Docker image built, app is running, and unused images are removed."