#!/bin/bash

docker compose down
docker images | awk '{print $3}' | grep -v 'IMAGE' | xargs docker image rm
docker volume prune

