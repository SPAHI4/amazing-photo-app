#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -yw
sudo apt-get install ec2-instance-connect
apt-get install -y docker.io
systemctl start docker
systemctl enable docker
echo "${env}" > /home/ubuntu/environment.env

docker pull ${repository_url}:server-${git_sha}
docker pull ${repository_url}:worker-${git_sha}
docker pull ${repository_url}:migrate-${git_sha}

docker run -d -p 443:443 --restart=always \
  --env-file /home/ubuntu/environment.env \
  ${repository_url}:server-${git_sha}

docker run -d --restart=always \
    --env-file /home/ubuntu/environment.env \
  ${repository_url}:worker-${git_sha}

docker run -d --rm \
    --env-file /home/ubuntu/environment.env \
  ${repository_url}:migrate-${git_sha}