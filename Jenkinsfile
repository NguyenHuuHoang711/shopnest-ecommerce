pipeline {
    agent any

    environment {
        REGISTRY       = "ghcr.io"
        IMAGE_BACKEND  = "nguyenhuuhoang711/shopnest-backend"
        IMAGE_FRONTEND = "nguyenhuuhoang711/shopnest-frontend"
        COMPOSE_DIR    = "/opt/shopnest"
    }

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'image', value: '$.image'],
                [key: 'sha',   value: '$.sha']
            ],
            token: 'shopnest-deploy',
            causeString: 'Triggered by GitHub Actions push of $sha',
            printContributedVariables: true,
            printPostContent: true
        )
    }

    stages {
        stage('Login to GHCR') {
            steps {
                script {
                    try {
                        withCredentials([string(credentialsId: 'GHCR_TOKEN', variable: 'GHCR_TOKEN')]) {
                            sh '''
                                if [ -n "$GHCR_TOKEN" ]; then
                                    echo "$GHCR_TOKEN" | docker login ghcr.io -u nguyenhuuhoang711 --password-stdin
                                    echo "Logged in to GHCR"
                                fi
                            '''
                        }
                    } catch (err) {
                        echo "GHCR_TOKEN credential not provided in Jenkins, continuing with public / existing login..."
                    }
                }
            }
        }

        stage('Sync Code & Prepare') {
            steps {
                sh '''
                    echo "Syncing repository code to ${COMPOSE_DIR}..."
                    cp -r ./* ${COMPOSE_DIR}/
                '''
            }
        }

        stage('Pull or Build Docker Images') {
            steps {
                sh '''
                    echo "Pulling latest ShopNest images or building locally..."
                    cd ${COMPOSE_DIR}
                    docker compose pull backend frontend || docker compose build backend frontend
                    echo "Images ready for deployment."
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Deploying ShopNest services..."
                    cd ${COMPOSE_DIR}

                    # Re-create and restart backend + frontend
                    docker compose up -d --force-recreate --remove-orphans backend frontend

                    echo "Waiting for services to initialize..."
                    sleep 5

                    docker compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Running health checks on deployed services..."

                    # Wait up to 30s for API and Frontend to be healthy
                    for i in $(seq 1 6); do
                        API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://backend:3000/api/health)
                        if [ "$API_STATUS" != "200" ]; then
                            API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://frontend/api/health)
                        fi
                        if [ "$API_STATUS" != "200" ]; then
                            API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
                        fi
                        if [ "$API_STATUS" != "200" ]; then
                            API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health)
                        fi

                        FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://frontend/)
                        if [ "$FE_STATUS" != "200" ]; then
                            FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
                        fi
                        
                        if [ "$API_STATUS" = "200" ] && [ "$FE_STATUS" = "200" ]; then
                            echo "✅ Health check PASSED: API HTTP $API_STATUS, Frontend HTTP $FE_STATUS"
                            break
                        fi
                        echo "Attempt $i/6: API=$API_STATUS, Frontend=$FE_STATUS. Waiting 5s..."
                        sleep 5
                    done

                    if [ "$API_STATUS" != "200" ]; then
                        echo "❌ API Health check FAILED after 30s"
                        exit 1
                    fi

                    echo "🎉 Deploy complete and verified!"
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh '''
                    echo "=== Cleaning up old Docker images (keep 3 newest per service) ==="
                    KEEP=3

                    for IMAGE in ${REGISTRY}/${IMAGE_BACKEND} ${REGISTRY}/${IMAGE_FRONTEND}; do
                        echo "--- Processing: $IMAGE ---"

                        # Lấy danh sách image IDs theo thứ tự mới → cũ, bỏ qua $KEEP cái đầu
                        OLD_IDS=$(docker images --format "{{.ID}}" "$IMAGE" | awk "NR > $KEEP")

                        if [ -n "$OLD_IDS" ]; then
                            echo "Removing old images for $IMAGE:"
                            echo "$OLD_IDS" | xargs docker rmi -f || true
                        else
                            echo "Nothing to remove for $IMAGE (<= $KEEP images exist)"
                        fi
                    done

                    # Dọn dangling images (<none>) tích tụ từ các lần pull
                    echo "--- Pruning dangling images ---"
                    docker image prune -f

                    echo "=== Cleanup complete. Remaining ShopNest images: ==="
                    docker images | grep -E "shopnest|REPOSITORY" || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ ShopNest deployed successfully via Jenkins from GHCR!"
        }
        failure {
            echo "❌ Deploy failed! Outputting recent docker compose logs:"
            sh '''
                cd ${COMPOSE_DIR} && docker compose logs --tail=30 || true
            '''
        }
        always {
            sh 'docker logout ghcr.io || true'
        }
    }
}
