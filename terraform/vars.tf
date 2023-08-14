variable "aws_region" {
  default = "eu-north-1"
}

variable "ecr_repository_name" {
  default = "spahi4-photo-app"
}

variable "db_password" {}

variable "db_app_username" {}
variable "db_app_password" {}

variable "db_instance_name" {
    default = "photo-app-pg"
}

variable "db_app_name" {
  default = {
    development = "photo_app_dev"
    production  = "photo_app_prod"
  }
}

variable "deployer_public_key" {}

variable "s3_bucket_terraform" {}


variable "s3_bucket_client" {
  default = {
    development = "spahi4-photo-client-dev"
    production  = "spahi4-photo-client-prod"
  }
}

variable "s3_bucket_storage" {
  default = {
    development = "spahi4-photo-storage-dev"
    production  = "spahi4-photo-storage-prod"
  }
}

variable "git_sha" {}

variable "cloudflare_account_id" {}

variable "cloudflare_api_token" {}

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

variable "jwt_public_key" {}
variable "jwt_private_key" {}

variable "ssl_cert" {}
variable "ssl_key" {}

variable "google_refresh_token" {}

variable "google_credentials_web" {
  type = object({
    client_id     = string
    client_secret = string
    redirect_uri = string
  })
}

variable "google_credentials_installed" {
  type = object({
    client_id     = string
    client_secret = string
    redirect_uri = string
  })
}