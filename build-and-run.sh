#!/bin/bash

# Define your app name and image name
APP_NAME="webhook-handler-app"
IMAGE_NAME="webhook-handler-app-image"

# Stop the running container (if it exists)
if docker ps -a --filter "name=$APP_NAME" --format '{{.Names}}' | grep -q $APP_NAME; then
  docker stop $APP_NAME
  docker rm $APP_NAME
fi

# Build the Docker image
docker build -t $IMAGE_NAME .

# Run the Docker container
docker run -d -p 3000:3000 --name $APP_NAME $IMAGE_NAME

# Remove all unused images related to the app
docker rmi "$(docker images -q -f "dangling=true" -f "ancestor=$IMAGE_NAME")"

echo "Docker image built, app is running, and unused images are removed."