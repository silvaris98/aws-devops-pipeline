pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://localhost:9000'
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
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=spacexp-sample \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/reports/** \
                          -Dsonar.coverage.exclusions=**/* \
                          -Dsonar.host.url=${SONAR_HOST_URL}
                    '''
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d --build'
                sh '''
                    echo "Waiting for Selenium Grid to be fully ready..."
                    until curl -s http://localhost:4444/wd/hub/status | grep -q '"ready": true'; do
                        echo "Selenium Grid is starting... waiting 3 seconds."
                        sleep 3
                    done
                    echo "Selenium Grid is READY!"
                '''
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
                echo 'Building and pushing Docker image...'
                // Add your Docker build/push commands here
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                echo 'Deploying infrastructure with Terraform...'
                // Add your Terraform commands here
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
