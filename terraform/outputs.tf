# ==========================================
# Terraform Outputs
# ==========================================

output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.website_bucket.id
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_domain_name" {
  description = "The URL of the CloudFront distribution endpoint"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}
