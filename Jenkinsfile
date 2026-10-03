pipeline {
    agent any

    environment {
        COMPOSE_DIR = "/opt/shopnest"
    }

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref'],
                [key: 'sha', value: '$.after']
            ],
            token: 'shopnest-deploy',
            causeString: 'Triggered by GitHub push $sha',
            printContributedVariables: true,
            printPostContent: true
        )
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=== Stage 1: Checkout Source Code from GitHub ==="
                checkout scm
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

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "=== Stage 2: Building ShopNest Docker Images locally ==="
                    cd ${COMPOSE_DIR}
                    docker compose build backend frontend
                    echo "Images built successfully."
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "=== Stage 3: Deploying with Docker Compose ==="
                    cd ${COMPOSE_DIR}
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
                    echo "=== Stage 4: Health Check ==="
                    for i in $(seq 1 6); do
                        API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://backend:3000/api/health)
                        if [ "$API_STATUS" != "200" ]; then
                            API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://frontend/api/health)
                        fi

                        FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://frontend/)
                        
                        if [ "$API_STATUS" = "200" ] && [ "$FE_STATUS" = "200" ]; then
                            echo "✅ Health check PASSED: API HTTP $API_STATUS, Frontend HTTP $FE_STATUS"
                            break
                        fi
                        echo "Attempt $i/6: API=$API_STATUS, Frontend=$FE_STATUS. Waiting 5s..."
                        sleep 5
                    done

                    if [ "$API_STATUS" != "200" ] || [ "$FE_STATUS" != "200" ]; then
                        echo "❌ Health check FAILED: API=$API_STATUS, Frontend=$FE_STATUS"
                        exit 1
                    fi
                    echo "🎉 Deployment verified successfully!"
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh '''
                    echo "=== Stage 5: Cleanup dangling images ==="
                    docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 ShopNest CI/CD Pipeline completed successfully via Jenkins!"
        }
        failure {
            echo "❌ Pipeline failed! Recent docker compose logs:"
            sh 'cd /opt/shopnest && docker compose logs --tail=30 || true'
        }
    }
}
