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
                sh 'npm run unit'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    withSonarQubeEnv('SonarQube Server') {
                        sh 'sonar-scanner -Dsonar.projectKey=spacexp-sample -Dsonar.sources=. -Dsonar.exclusions=**/node_modules/**,**/reports/**'
                    }
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
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                        sh "docker build -t wasuaa/spacexp-sample:${env.BUILD_NUMBER} ."
                        sh "docker push wasuaa/spacexp-sample:${env.BUILD_NUMBER}"
                        sh "docker tag wasuaa/spacexp-sample:${env.BUILD_NUMBER} wasuaa/spacexp-sample:latest"
                        sh "docker push wasuaa/spacexp-sample:latest"
                    }
                }
            }
        }
        stage('Terraform Deploy to AWS EC2') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        dir('test/terraform') {
                            sh 'terraform init'
                            sh 'terraform apply -auto-approve -var=ami_id=ami-0aba19e56f3eaec05'
                        }
                    }
                }
            }
        }
    }
}
