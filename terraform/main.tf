terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# ─────────────────────────────────────────────────────────────
# 1. DEDICATED VPC (Cách ly 100%, không chạm vào default hay VPC có sẵn)
# ─────────────────────────────────────────────────────────────
resource "google_compute_network" "shopnest_vpc" {
  name                    = "shopnest-isolated-vpc"
  auto_create_subnetworks = false
  description             = "VPC độc lập cho ShopNest - không dùng chung với bất kỳ service nào khác"
}

# ─────────────────────────────────────────────────────────────
# 2. DEDICATED SUBNET
# ─────────────────────────────────────────────────────────────
resource "google_compute_subnetwork" "shopnest_subnet" {
  name          = "shopnest-isolated-subnet"
  ip_cidr_range = "10.150.0.0/24"
  region        = var.region
  network       = google_compute_network.shopnest_vpc.id
  description   = "Subnet độc lập cho ShopNest"
}

# ─────────────────────────────────────────────────────────────
# 3. DEDICATED FIREWALL (Chỉ áp dụng trên shopnest-isolated-vpc)
# ─────────────────────────────────────────────────────────────
resource "google_compute_firewall" "shopnest_firewall" {
  name        = "shopnest-isolated-firewall"
  network     = google_compute_network.shopnest_vpc.name
  description = "Firewall chỉ áp dụng trên shopnest-isolated-vpc"

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443", "8080", "3000"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["shopnest-spot"]
}

# ─────────────────────────────────────────────────────────────
# 4. DEDICATED SERVICE ACCOUNT (Không dùng default compute SA)
# ─────────────────────────────────────────────────────────────
resource "google_service_account" "shopnest_sa" {
  account_id   = "shopnest-isolated-sa"
  display_name = "ShopNest Spot VM Service Account"
  description  = "Service account độc lập chỉ cấp riêng cho ShopNest VM"
}

# ─────────────────────────────────────────────────────────────
# 5. SPOT VM INSTANCE
# ─────────────────────────────────────────────────────────────
resource "google_compute_instance" "spot_vm" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  tags = ["shopnest-spot"]

  # Cấu hình Spot Instance: giảm giá 60-91%
  scheduling {
    provisioning_model          = "SPOT"
    preemptible                 = true
    automatic_restart           = false
    instance_termination_action = "STOP"
  }

  boot_disk {
    auto_delete = true # Cho phép terraform destroy xoá sạch đĩa
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2404-lts-amd64"
      size  = var.boot_disk_size_gb
      type  = "pd-balanced"
      labels = {
        app        = "shopnest"
        managed_by = "terraform"
      }
    }
  }

  network_interface {
    network    = google_compute_network.shopnest_vpc.id
    subnetwork = google_compute_subnetwork.shopnest_subnet.id
    access_config {
      // Ephemeral public IP
    }
  }

  metadata_startup_script = file("${path.module}/scripts/startup.sh")

  service_account {
    email  = google_service_account.shopnest_sa.email
    scopes = ["cloud-platform"]
  }

  labels = {
    app        = "shopnest"
    managed_by = "terraform"
    env        = "dev-spot"
  }
}
