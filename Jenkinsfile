pipeline {
    agent any

    environment {
        // Docker Hub username eka metanata danna
        IMAGE_NAME = "wasuaa/spacexp-sample"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
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
                sh 'npm run unit || true'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'package.json, server.js', fingerprint: true
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('SonarQube Server') {
                        sh '''
                          sonar-scanner \
                          -Dsonar.projectKey=spacexp-sample \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Wait for Quality Gate') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d --build'
                sh 'sleep 6'
                sh 'npm test || (docker-compose -f docker-compose.yml down; exit 1)'
            }
            post {
                always {
                    junit 'reports/TESTS-results.xml'
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker tag ${IMAGE_NAME}:${DOCKER_TAG} ${IMAGE_NAME}:latest"
                    sh "docker push ${IMAGE_NAME}:${DOCKER_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    dir('terraform') {
                        sh 'terraform init -input=false'
                        sh "terraform apply -auto-approve -var='docker_image=${IMAGE_NAME}:${DOCKER_TAG}'"
                        sh 'terraform output -json'
                    }
                }
            }
        }

        stage('Post-deploy Smoke Test') {
            steps {
                script {
                    def ip = sh(returnStdout: true, script: "cd terraform && terraform output -raw public_ip").trim()
                    sh "curl -f http://${ip}:8080/ || (echo 'Smoke test failed' && exit 1)"
                    echo "App reachable at http://${ip}:8080"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline successful."
        }
        failure {
            echo "Pipeline failed. Check stage logs and SonarQube/test reports."
        }
    }
}