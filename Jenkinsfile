pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://16.171.137.199:9000'
    }

    stages {
        stage('Checkout SCM') {
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
                    archiveArtifacts artifacts: '**', allowEmptyArchive: true
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube Server') {
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=spacexp-sample \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,**/reports/** \
                        -Dsonar.coverage.exclusions=**/* \
                        -Dsonar.host.url=${SONAR_HOST_URL}
                    """
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                sh '''
                    # Old container cleanup to prevent port binding issues
                    docker-compose -f docker-compose.yml down --remove-orphans || true
                    
                    # Build and start services
                    docker-compose -f docker-compose.yml up -d --build
                '''
                
                // Selenium test integration script execution
                sh 'npm test'
            }
            post {
                always {
                    junit testResults: '**/reports/*.xml', allowEmptyResults: true
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                echo 'Building and pushing production Docker image...'
                // Add your docker build & push steps here
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                echo 'Deploying infrastructure using Terraform...'
                // Add your terraform apply steps here
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
