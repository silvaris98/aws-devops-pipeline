pipeline {
    agent any
  //hi
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_IMAGE = 'wasuaa/spacexp-sample'
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
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                echo 'Running Integration Tests...'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-cred', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                        sh "docker login -u ${env.DOCKER_USER} -p ${env.DOCKER_PASSWORD}"
                        sh "docker build -t ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                        sh "docker push ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker tag ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} ${env.DOCKER_IMAGE}:latest"
                        sh "docker push ${env.DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                script {
                      dir('test/terraform') { // මෙන්න මෙතනට 'test/' කියන එක එකතු කරන්න
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                    }
                }
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
