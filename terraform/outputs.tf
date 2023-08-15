#output "database_url" {
#  value = data.template_file.environment.vars.database_url
#}
#
#output "root_database_url" {
#  value = data.template_file.environment.vars.root_database_url
#}

output "api_origin" {
  value     = "https://${local.api_domain}"
  sensitive = false
}

output "web_origin" {
  value     = "https://${local.web_domain}"
  sensitive = false
}

output "client_bucket" {
  value     = aws_s3_bucket.client.bucket
  sensitive = false
}