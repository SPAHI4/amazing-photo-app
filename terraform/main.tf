terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.12.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.12.0"
    }
  }
  backend "s3" {
    bucket = "spahi4-photo-app-terraform"
    key    = "terraform.tfstate"
    region = "eu-north-1"
  }
}

locals {
  s3_bucket_client  = var.s3_bucket_client[terraform.workspace]
  s3_bucket_storage = var.s3_bucket_storage[terraform.workspace]
  api_domain        = var.api_domain[terraform.workspace]
  web_domain        = var.web_domain[terraform.workspace]
}

provider "aws" {
  region = var.aws_region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "default" {
  name       = var.root_domain
  account_id = var.cloudflare_account_id
}

resource "aws_default_subnet" "default" {
  availability_zone = "eu-north-1a"
}

data "aws_ecr_repository" "ecr_repository" {
  name = var.ecr_repository_name
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web"
  description = "Allow web inbound traffic"

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = var.deployer_public_key
}

data "template_file" "environment" {
  template = file("${path.module}/server.tpl.env")

  vars = {
    root_database_url = "postgres://${aws_db_instance.default.username}:${aws_db_instance.default.password}@${aws_db_instance.default.address}:${aws_db_instance.default.port}/${aws_db_instance.default.name}",
    database_url = "postgres://${var.db_app_username}:${var.db_app_password}@${aws_db_instance.default.address}:${aws_db_instance.default.port}/${var.db_app_name}",

    aws_region     = var.aws_region
    s3_bucket_name = aws_s3_bucket.storage.bucket

    jwt_public_key  = var.jwt_public_key
    jwt_private_key = var.jwt_private_key
    ssl_cert       = var.ssl_cert
    ssl_key        = var.ssl_key
  }
}

data "template_file" "init" {
  template = file("${path.module}/init-servers.tpl.sh")

  vars = {
    env = data.template_file.environment.rendered
    repository_url = data.aws_ecr_repository.ecr_repository.repository_url
    git_sha = var.git_sha
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  key_name = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.allow_web.id, aws_security_group.allow_db.id]

  tags = {
    Name = "photo-app"
  }

  user_data = data.template_file.init.rendered
}

resource "aws_security_group" "allow_db" {
  name        = "allow_db"
  description = "Allow inbound traffic from EC2 instances"

  ingress {
    description = "PostgreSQL from VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_eip" "app" {
  domain   = "vpc"
  instance = aws_instance.app.id
}

resource "cloudflare_record" "ecs_api" {
  name    = local.api_domain
  value   = aws_eip.app.public_dns
  type    = "CNAME"
  zone_id = data.cloudflare_zone.default.id
  proxied = false
}

resource "aws_db_instance" "default" {
  identifier             = var.db_instance_name
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.micro"
  username               = "postgres"
  password               = var.db_password
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.allow_db.id]
  tags                   = {
    Name = "photo-app"
  }
  iam_database_authentication_enabled = true
  auto_minor_version_upgrade          = true
}

resource "aws_s3_bucket" "client" {
  bucket = local.s3_bucket_client

  tags = {
    Name = "photo-app"
  }
}

resource "aws_s3_bucket_website_configuration" "client" {
  bucket = aws_s3_bucket.client.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "cloudflare_record" "s3_website" {
  name    = local.web_domain
  value   = aws_s3_bucket_website_configuration.client.website_endpoint
  type    = "CNAME"
  zone_id = data.cloudflare_zone.default.id
  proxied = false
}

resource "aws_s3_bucket" "storage" {
  bucket = local.s3_bucket_storage

  tags = {
    Name = "photo-app"
  }
}

resource "aws_s3_bucket_versioning" "storage" {
  bucket = aws_s3_bucket.storage.id

  enabled = true
}

resource "aws_s3_bucket_cors_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}