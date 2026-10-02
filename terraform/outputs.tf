output "instance_name" {
  description = "Tên Spot VM"
  value       = google_compute_instance.spot_vm.name
}

output "public_ip" {
  description = "Địa chỉ Public IP của Spot VM"
  value       = google_compute_instance.spot_vm.network_interface[0].access_config[0].nat_ip
}

output "vpc_network" {
  description = "VPC độc lập được tạo riêng"
  value       = google_compute_network.shopnest_vpc.name
}

output "ssh_command" {
  description = "Lệnh SSH vào máy Spot VM"
  value       = "gcloud compute ssh ${google_compute_instance.spot_vm.name} --zone=${var.zone}"
}

output "workload_identity_provider" {
  description = "Workload Identity Provider cho GitHub Actions OIDC"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "deploy_service_account" {
  description = "Service Account email cho GitHub Actions OIDC"
  value       = google_service_account.github_deploy.email
}

output "destroy_guide" {
  description = "Lệnh hủy toàn bộ tài nguyên khi không dùng"
  value       = "terraform destroy -auto-approve"
}
