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
                withCredentials([string(credentialsId: 'GHCR_TOKEN', variable: 'GHCR_TOKEN')]) {
                    sh '''
                        if [ -n "$GHCR_TOKEN" ]; then
                            echo "$GHCR_TOKEN" | docker login ghcr.io -u nguyenhuuhoang711 --password-stdin
                            echo "Logged in to GHCR"
                        else
                            echo "GHCR_TOKEN not provided, continuing with public / existing login..."
                        fi
                    '''
                }
            }
        }

        stage('Pull latest images from GHCR') {
            steps {
                sh '''
                    echo "Pulling latest ShopNest images from GHCR..."
                    docker pull ${REGISTRY}/${IMAGE_BACKEND}:latest || true
                    docker pull ${REGISTRY}/${IMAGE_FRONTEND}:latest || true
                    echo "Image pull completed."
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Deploying ShopNest services..."
                    cd ${COMPOSE_DIR}

                    # Re-create and restart backend + frontend
                    docker compose up -d --remove-orphans backend frontend

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
                        API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "000")
                        FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
                        
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
