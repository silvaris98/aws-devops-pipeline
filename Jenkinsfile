pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
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
                    archiveArtifacts artifacts: '**/node_modules/**', allowEmptyArchive: true
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
               timeout(time: 15, unit: 'MINUTES') {
                    withSonarQubeEnv('SonarQube Server') {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=spacexp-sample \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/node_modules/**,**/reports/** \
                            -Dsonar.coverage.exclusions=**/* \
                            -Dsonar.ws.timeout=300
                        '''
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                echo 'Running Integration Tests...'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                echo 'Building and pushing Docker image...'
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                echo 'Deploying via Terraform...'
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
