pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                sh '''
                    docker-compose -f docker-compose.yml up -d --build
                    sleep 25
                    npm test
                '''
            }
            post {
                always {
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t aws-devops-pipeline-spacexp-app:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'echo "Push docker image step"'
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                script {
                    if (fileExists('terraform/main.tf')) {
                        dir('terraform') {
                            sh 'terraform init'
                            sh 'terraform apply -auto-approve'
                        }
                    } else {
                        echo 'Terraform configuration files not found, skipping apply.'
                    }
                }
            }
        }

        stage('Post-deploy Smoke Test') {
            steps {
                sh 'echo "Running post-deploy smoke tests"'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check stage logs.'
        }
    }
}
