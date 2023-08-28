# Terraform config

This directory contains terraform configuration for the app.

Current configuration supports workspace for each deployment environment (development or production), run by github actions.

### Resources
Major resources that are used/created by this file include:

* AWS ECR Repository for docker images built by github actions
* AWS Security Groups
* AWS AMI (Amazon Linux 2)
* AWS EC2 Instance (with docker and docker-compose defined as [./setup/init-servers.tpl.sh](./setup/init-servers.tpl.sh))
* AWS RDS PostgreSQL Instance (with init sql defined as [./setup/init-db.tpl.sql](./setup/init-db.tpl.sql))
* AWS S3 bucket for SPA static files and images
* AWS IAM roles, instance profiles and policies
* Cloudflare DNS records proxying to EC2 instance and S3 bucket
* Cloudflare worker script and route for client-side 404 handling ([./setup/cloudflare-worker.js](./setup/cloudflare-worker.js))
* Cloudflare page rule for sitemap.xml redirection from S3 bucket to EC2 instance


### TODO
* [ ] Disallow public access to the RDS instance. Currently it is possible to connect to the database from any IP address to simplify initial setup.
* [ ] Use posgresql provider instead of local-exec to run initial db setup
* [ ] Use terraform modules to split configuration into smaller parts
* [ ] Don't recreate EC2 instance on every deployment, just update changed containers
