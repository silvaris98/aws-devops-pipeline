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

        stage('SonarQube Analysis') {
            steps {
                sh 'echo "SonarQube analysis step"'
            }
        }

        stage('Wait for Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
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
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Post-deploy Smoke Test') {
            steps {
                sh 'node test/smoke.test.js'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed. Check stage logs and SonarQube/test reports.'
        }
    }
}
