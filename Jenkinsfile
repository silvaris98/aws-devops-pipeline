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
                script {
                    try {
                        sh 'docker-compose -f docker-compose.yml up -d --build'
                        // වෙබ් ඇප් එක සම්පූර්ණයෙන්ම ස්ටාර්ට් වන තෙක් තත්පර 25ක් රැඳී සිටියි
                        sh 'sleep 25'
                        sh 'npm test'
                    } finally {
                        sh 'docker-compose -f docker-compose.yml down'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // SonarQube ස්කෑන් කිරීමේ විධානයන් මෙහි ඇත
                }
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
                script {
                    // ඩොකර් රෙජისტ්‍රි වෙත පුෂ් කිරීමේ විධානයන් මෙහි ඇත
                }
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
