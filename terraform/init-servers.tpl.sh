#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -yw
sudo apt-get install ec2-instance-connect
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo echo "${env}" > /home/ubuntu/environment.env

sudo docker pull ${repository_url}:server-"${git_sha}"
sudo docker pull ${repository_url}:worker-"${git_sha}"
sudo docker pull ${repository_url}:migrate-"${git_sha}"

sudo docker run -d -p 443:443 --restart=always \
  --env-file /home/ubuntu/environment.env \
  "${repository_url}":server-"${git_sha}"

sudo docker run -d --restart=always \
    --env-file /home/ubuntu/environment.env \
  ${repository_url}:worker-"${git_sha}"

sudo docker run -d --rm \
    --env-file /home/ubuntu/environment.env \
  ${repository_url}:migrate-"${git_sha}"