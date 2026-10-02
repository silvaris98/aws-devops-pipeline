pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE_NAME = 'wasuaa/spacexp-app'
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
                    archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
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
                        -Dsonar.host.url=http://localhost:9000
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
                    junit allowEmptyResults: true, testResults: 'reports/*.xml'
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS_ID}") {
                        def appImage = docker.build("${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}")
                        appImage.push()
                        appImage.push('latest')
                    }
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
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check stage logs and SonarQube/test reports.'
        }
    }
}
