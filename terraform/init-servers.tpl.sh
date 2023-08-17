#!/bin/bash
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
echo "${env}" > /home/environment.env

docker pull ${repository_url}:server-"${git_sha}"
docker pull ${repository_url}:worker-"${git_sha}"
docker pull ${repository_url}:migrate-"${git_sha}"

docker run -d -p 443:443 --restart=always \
  --env-file /home/environment.env \
  "${repository_url}":server-"${git_sha}"

sudo docker run -d --restart=always \
    --env-file /home/environment.env \
  ${repository_url}:worker-"${git_sha}"

sudo docker run -d --rm \
    --env-file /home/environment.env \
  ${repository_url}:migrate-"${git_sha}"