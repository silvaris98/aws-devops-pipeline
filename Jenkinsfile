pipeline {
    agent any

    environment {
        SELENIUM_HUB_URL = 'http://localhost:4444/wd/hub'
        APP_URL          = 'http://app:3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh 'npm install'
                sh 'npm run unit'
            }
            post {
                always {
                    archiveArtifacts artifacts: '**/reports/*.xml', allowEmptyArchive: true
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube Server') {
                    sh 'sonar-scanner -Dsonar.projectKey=spacexp-sample -Dsonar.sources=. -Dsonar.exclusions=**/node_modules/**,**/reports/** -Dsonar.host.url=http://localhost:9000'
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                // Containers Up කිරීම
                sh 'docker-compose -f docker-compose.yml up -d --build'

                // Selenium Grid එක fully status 'ready: true' වන තෙක් wait කිරීම
                sh '''
                    echo "Waiting for Selenium Grid to be fully ready..."
                    until curl -s http://localhost:4444/wd/hub/status | grep -q '"ready": true'; do
                        echo "Selenium Grid is starting... waiting 3 seconds."
                        sleep 3
                    done
                    echo "Selenium Grid is READY!"
                '''

                // Integration Tests Run කිරීම
                sh 'npm test'
            }
            post {
                always {
                    junit '**/reports/*.xml'
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building production Docker image...'
                sh 'docker build -t spacexp-sample-app:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to registry...'
                // sh 'docker push your-registry/spacexp-sample-app:latest'
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                echo 'Deploying infrastructure using Terraform...'
                // sh 'cd terraform && terraform init && terraform apply -auto-approve'
            }
        }

        stage('Post-deploy Smoke Test') {
            steps {
                echo 'Running post-deployment validation...'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Check stage logs and SonarQube/test reports.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}
