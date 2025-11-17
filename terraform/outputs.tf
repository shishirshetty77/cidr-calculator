output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "GKE Cluster Host"
  sensitive   = true
}

output "region" {
  value       = var.region
  description = "GCP Region"
}

output "zone" {
  value       = var.zone
  description = "GCP Zone"
}

output "project_id" {
  value       = var.project_id
  description = "GCP Project ID"
}

output "ingress_ip_address" {
  value       = google_compute_global_address.ingress_ip.address
  description = "Static IP address for Ingress"
}

output "vpc_network" {
  value       = google_compute_network.vpc.name
  description = "VPC Network Name"
}

output "subnet" {
  value       = google_compute_subnetwork.subnet.name
  description = "Subnet Name"
}

output "configure_kubectl" {
  value       = "gcloud container clusters get-credentials ${google_container_cluster.primary.name} --zone ${var.zone} --project ${var.project_id}"
  description = "Command to configure kubectl"
}
