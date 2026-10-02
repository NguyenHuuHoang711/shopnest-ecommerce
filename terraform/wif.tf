# ─────────────────────────────────────────────────────────────
# Workload Identity Federation (OIDC) cho GitHub Actions
# Cho phép GitHub Actions deploy vào GCP Spot VM không cần private key
# ─────────────────────────────────────────────────────────────

# 1. Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "shopnest-gh-pool"
  display_name              = "ShopNest GitHub Pool"
  description               = "OIDC Pool cho GitHub Actions shopnest-ecommerce"
}

# 2. OIDC Provider kết nối GitHub Actions
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "shopnest-gh-provider"
  display_name                       = "ShopNest GitHub OIDC Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
    "attribute.actor"      = "assertion.actor"
  }

  # Khóa cứng: Chỉ chấp nhận token từ đúng repository NguyenHuuHoang711/shopnest-ecommerce
  attribute_condition = "assertion.repository == 'NguyenHuuHoang711/shopnest-ecommerce'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# 3. Service Account Deploy cho GitHub Actions
resource "google_service_account" "github_deploy" {
  account_id   = "shopnest-gh-deploy"
  display_name = "ShopNest GitHub Actions Deploy SA"
  description  = "Service Account dùng bởi GitHub Actions qua OIDC để deploy lên Spot VM"
}

# 4. Gán quyền Workload Identity User cho GitHub repo
resource "google_service_account_iam_member" "wif_binding" {
  service_account_id = google_service_account.github_deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/NguyenHuuHoang711/shopnest-ecommerce"

  depends_on = [google_iam_workload_identity_pool_provider.github_provider]
}

# 5. Cấp quyền tối thiểu cho SA để điều khiển Spot VM
resource "google_project_iam_member" "deploy_compute_admin" {
  project = var.project_id
  role    = "roles/compute.instanceAdmin.v1"
  member  = "serviceAccount:${google_service_account.github_deploy.email}"
}

resource "google_project_iam_member" "deploy_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_deploy.email}"
}
