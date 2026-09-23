#!/bin/bash
set -e
apt-get update -y
apt-get install -y docker.io
systemctl start docker
docker pull ${docker_image}
docker run -d --name myapp -p 8080:8080 --restart=always ${docker_image}