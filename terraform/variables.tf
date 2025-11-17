variable "credentials_file" {
  description = "Path to GCP service account credentials JSON file"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "cidr-calculator"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone for zonal cluster (free tier optimization)"
  type        = string
  default     = "us-central1-a"
}

variable "gke_num_nodes" {
  description = "Number of GKE nodes (free tier: 1)"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "GKE node machine type (free tier: e2-small)"
  type        = string
  default     = "e2-small"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
