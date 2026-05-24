# ==========================================
# Terraform Variables Definitions
# ==========================================

variable "aws_region" {
  type        = string
  description = "AWS region to deploy infrastructure"
  default     = "us-east-1"
}

variable "bucket_name" {
  type        = string
  description = "Unique globally matching S3 bucket name"
  default     = "devops-dinh-cong-duyen-portfolio-bucket"
}

variable "common_tags" {
  type        = map(string)
  description = "Common tags applied to all AWS resources"
  default = {
    Environment = "Production"
    Project     = "DevOps-Portfolio"
    ManagedBy   = "Terraform"
  }
}
