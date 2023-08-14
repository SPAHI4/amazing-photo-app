output "database_url" {
  value = data.template_file.environment.vars.database_url
}

output "root_database_url" {
  value = data.template_file.environment.vars.root_database_url
}

locals {
  api_domain        = var.api_domain[terraform.workspace]
  web_domain        = var.web_domain[terraform.workspace]
}

output "api_origin" {
  value = "https://${local.api_domain}"
}

output "web_origin" {
  value = "https://${local.web_domain}"
}