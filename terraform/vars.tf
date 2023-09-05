variable "aws_region" {
  default = "eu-north-1"
}

variable "aws_access_key_id" {
  sensitive = true
}
variable "aws_secret_access_key" {
  sensitive = true
}

variable "ecr_repository_name" {
  default = "spahi4-photo-app"
}

variable "ec2_instance_type" {
  default = {
    development = "t3.micro"
    production  = "t3.small"
  }
}

variable "upload_enabled" {
  default = true
}

variable "db_password" {
  sensitive = true
}

variable "db_app_username" {
  sensitive = true
}
variable "db_app_password" {
  sensitive = true
}

variable "db_instance_name" {
  default = "photo-app-pg"
}

variable "db_app_name" {
  default = {
    development = "photo_app_dev"
    production  = "photo_app_prod"
  }
}

variable "resource_prefix" {
  default = {
    development = ""
    production  = "prod-"
  }
}

variable "deployer_public_key" {
  sensitive = true
}

variable "s3_bucket_terraform" {}

variable "s3_bucket_storage" {
  default = {
    development = "spahi4-photo-images-dev"
    production  = "spahi4-photo-images-prod"
  }
}

variable "git_sha" {}

variable "cloudflare_account_id" {
  sensitive = true
}

variable "cloudflare_api_token" {
  sensitive = true
}

variable "root_domain" {
  default = "spahi4.me"
}

variable "web_domain" {
  default = {
    development = "dev.spahi4.me"
    production  = "spahi4.me"
  }
}

variable "api_domain" {
  default = {
    development = "api-dev.spahi4.me"
    production  = "api.spahi4.me"
  }
}

variable "jwt_public_key" {
  sensitive = true
}
variable "jwt_private_key" {
  sensitive = true
}

variable "ssl_cert" {
  sensitive = true
}
variable "ssl_key" {
  sensitive = true
}

variable "google_refresh_token" {
  sensitive = true
}

variable "google_credentials_web_json" {
  description = "JSON string of the google_credentials_web"
  type        = string
  default     = "{}"
  sensitive   = true

}

variable "google_credentials_installed_json" {
  description = "JSON string of the google_credentials_web"
  type        = string
  default     = "{}"
  sensitive   = true
}