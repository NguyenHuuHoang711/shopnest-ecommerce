variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-southeast1" # Singapore (lowest latency to Vietnam)
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "asia-southeast1-a"
}

variable "instance_name" {
  description = "Name of the Spot VM instance"
  type        = string
  default     = "shopnest-spot-vm"
}

variable "machine_type" {
  description = "Machine type for the Spot VM (e2-medium: 2 vCPU, 4GB RAM - tiết kiệm chi phí)"
  type        = string
  default     = "e2-medium"
}

variable "boot_disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 30
}
