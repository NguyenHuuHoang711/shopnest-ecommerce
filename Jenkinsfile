pipeline {
    agent any

    environment {
        REGISTRY     = "ghcr.io"
        IMAGE_NAME   = "nguyenhuuhoang711/shopnest-ecommerce"
        IMAGE_FULL   = "${REGISTRY}/${IMAGE_NAME}:latest"
        COMPOSE_FILE = "/home/ubuntu/actions-runner/_work/shopnest-ecommerce/shopnest-ecommerce/docker-compose.yml"
        COMPOSE_DIR  = "/home/ubuntu/actions-runner/_work/shopnest-ecommerce/shopnest-ecommerce"
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
                withCredentials([string(credentialsId: 'GHCR_TOKEN', variable: 'GHCR_TOKEN')]) {
                    sh '''
                        echo "$GHCR_TOKEN" | docker login ghcr.io -u nguyenhuuhoang711 --password-stdin
                        echo "Logged in to GHCR"
                    '''
                }
            }
        }

        stage('Pull latest image from GHCR') {
            steps {
                sh '''
                    echo "Pulling image: ${IMAGE_FULL}"
                    docker pull ${IMAGE_FULL}
                    echo "Pull complete: $(docker inspect --format='{{.Id}}' ${IMAGE_FULL} | cut -c1-20)"
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Deploying ShopNest with new image..."
                    cd ${COMPOSE_DIR}

                    # Stop only the backend, keep jenkins + nginx running
                    docker compose stop backend || true
                    docker compose rm -f backend || true

                    # Start backend with new image (no --build, pulls from GHCR)
                    docker compose up -d backend nginx

                    echo "Waiting for backend to start..."
                    sleep 5

                    docker compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Running health checks..."

                    # Wait up to 30s for backend to be ready
                    for i in $(seq 1 6); do
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
                        if [ "$STATUS" = "200" ]; then
                            echo "✅ API health check PASSED (HTTP 200)"
                            break
                        fi
                        echo "Attempt $i: API returned $STATUS, waiting..."
                        sleep 5
                    done

                    if [ "$STATUS" != "200" ]; then
                        echo "❌ Health check FAILED after 30s"
                        exit 1
                    fi

                    # Security checks
                    ENV_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/.env)
                    if [ "$ENV_STATUS" = "404" ] || [ "$ENV_STATUS" = "403" ]; then
                        echo "✅ Security: .env blocked (HTTP $ENV_STATUS)"
                    else
                        echo "⚠️  Security warning: .env returned HTTP $ENV_STATUS"
                    fi

                    echo "🎉 Deploy complete! Image: ${IMAGE_FULL}"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ ShopNest deployed successfully from GHCR image: ${IMAGE_FULL}"
        }
        failure {
            echo "❌ Deploy failed! Rolling back..."
            sh '''
                cd ${COMPOSE_DIR}
                docker compose up -d backend || true
            '''
        }
        always {
            sh 'docker logout ghcr.io || true'
        }
    }
}
