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
    template = {
      source  = "hashicorp/template"
      version = "~> 2.2.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.1"
    }
  }
  backend "s3" {
    bucket = "spahi4-photo-app-terraform"
    key    = "terraform.tfstate"
    region = "eu-north-1"
  }
}

locals {
  s3_bucket_client  = var.web_domain[terraform.workspace]
  s3_bucket_storage = var.s3_bucket_storage[terraform.workspace]
  api_domain        = var.api_domain[terraform.workspace]
  web_domain        = var.web_domain[terraform.workspace]
  db_app_name       = var.db_app_name[terraform.workspace]

  google_credentials_web_parsed       = sensitive(jsondecode(var.google_credentials_web_json))
  google_credentials_installed_parsed = sensitive(jsondecode(var.google_credentials_installed_json))
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

resource "aws_security_group" "allow_ec2" {
  name        = "allow_ec2"
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

resource "aws_security_group" "allow_ec2_ssh" {
  name        = "allow_ec2_ssh"
  description = "Allow SSH inbound traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
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
    root_database_url = "postgres://${aws_db_instance.default.username}:${aws_db_instance.default.password}@${aws_db_instance.default.endpoint}/postgres",
    database_url      = "postgres://${var.db_app_username}:${var.db_app_password}@${aws_db_instance.default.endpoint}/${local.db_app_name}",

    s3_bucket_region = var.aws_region
    s3_bucket_name   = aws_s3_bucket.storage.bucket

    jwt_public_key  = base64encode(var.jwt_public_key)
    jwt_private_key = base64encode(var.jwt_private_key)

    ssl_cert = base64encode(var.ssl_cert)
    ssl_key  = base64encode(var.ssl_key)

    google_refresh_token = var.google_refresh_token

    installed_google_client_id     = local.google_credentials_installed_parsed.installed.client_id
    installed_google_client_secret = local.google_credentials_installed_parsed.installed.client_secret
    installed_google_redirect_uri  = local.google_credentials_installed_parsed.installed.redirect_uris[0]
    web_google_client_id           = local.google_credentials_web_parsed.web.client_id
    web_google_client_secret       = local.google_credentials_web_parsed.web.client_secret
    web_google_redirect_uri        = local.google_credentials_web_parsed.web.redirect_uris[0]

    api_origin = "https://${local.api_domain}"
    api_port   = "443"
    web_origin = "https://${local.web_domain}"
  }
}

data "template_file" "init" {
  template = file("${path.module}/init-servers.tpl.sh")

  vars = {
    env            = data.template_file.environment.rendered
    repository_url = data.aws_ecr_repository.ecr_repository.repository_url
    git_sha        = var.git_sha
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  key_name = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [
    aws_security_group.allow_ec2.id,
    aws_security_group.allow_rds.id,
    aws_security_group.allow_ec2_ssh.id
  ]

  tags = {
    Name = "photo-app"
  }

  user_data = data.template_file.init.rendered
}

resource "aws_security_group" "allow_rds" {
  name        = "allow_rds"
  description = "Allow inbound traffic from EC2 instances"

  ingress {
    from_port   = 5432
    to_port     = 5432
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
  db_name                = "postgres"
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.allow_rds.id]
  tags = {
    Name = "photo-app"
  }
  iam_database_authentication_enabled = false
  auto_minor_version_upgrade          = true
  apply_immediately                   = true
  skip_final_snapshot                 = true
  publicly_accessible                 = true
}

data "template_file" "db_init" {
  template = file("${path.module}/init-db.tpl.sql")

  vars = {
    db_app_name     = local.db_app_name
    db_app_username = var.db_app_username
    db_app_password = var.db_app_password
  }
}

resource "null_resource" "db_init" {
  triggers = {
    instance_id = aws_db_instance.default.id
    db_app_name = local.db_app_name
  }

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    environment = {
      SQL        = data.template_file.db_init.rendered
      PGHOST     = aws_db_instance.default.address
      PGUSER     = aws_db_instance.default.username
      PGPASSWORD = aws_db_instance.default.password
      PGDATABASE = "postgres"
      PGPORT     = aws_db_instance.default.port
    }
    command = <<EOF
      createdb -h $PGHOST -U $PGUSER -p $PGPORT ${local.db_app_name} && \
      psql -h $PGHOST -U $PGUSER -d $PGDATABASE -p $PGPORT -c "$SQL";
    EOF
  }

  depends_on = [aws_db_instance.default]
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

data "cloudflare_ip_ranges" "cloudflare" {}

data "aws_iam_policy_document" "s3_bucket_policy_public" {
  statement {
    sid = "Allow CloudFlare IPv4"

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.client.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values   = data.cloudflare_ip_ranges.cloudflare.ipv4_cidr_blocks
    }
  }

  statement {
    sid = "Allow CloudFlare IPv6"

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.client.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values   = data.cloudflare_ip_ranges.cloudflare.ipv6_cidr_blocks
    }
  }
}

resource "aws_s3_bucket_public_access_block" "client" {
  bucket = aws_s3_bucket.client.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "client_policy" {
  bucket     = aws_s3_bucket.client.id
  policy     = data.aws_iam_policy_document.s3_bucket_policy_public.json
  depends_on = [aws_s3_bucket_public_access_block.client]
}

resource "cloudflare_record" "s3_website" {
  name    = local.web_domain
  value   = aws_s3_bucket_website_configuration.client.website_endpoint
  type    = "CNAME"
  zone_id = data.cloudflare_zone.default.id
  proxied = true
}

resource "aws_s3_bucket" "storage" {
  bucket = local.s3_bucket_storage

  tags = {
    Name = "photo-app"
  }
}

# redirect sitemap.xml from client to api
resource "cloudflare_page_rule" "sitemap_redirect" {
  zone_id = data.cloudflare_zone.default.id
  target  = "${local.web_domain}/sitemap.xml"

  actions {
    forwarding_url {
      status_code = 301
      url         = "https://${local.api_domain}/sitemap.xml"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "storage" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_versioning" "storage" {
  bucket = aws_s3_bucket.storage.id

  versioning_configuration {
    status = "Enabled"
  }
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