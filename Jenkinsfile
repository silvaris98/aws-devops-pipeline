pipeline {
    agent any
    
    environment {
        SONAR_HOST_URL = 'http://16.171.137.199:9000'
        SONAR_TOKEN    = 'sqa_0e4b902df0ba2e7c59f5da58038b4375c6a59c37'
        DOCKER_IMAGE   = 'wasuaa/spacexp-sample:latest'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install & Build') {
            steps {
                sh 'npm ci'
                sh 'npm run unit'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                sh '''
                    sonar-scanner \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_TOKEN} \
                    -Dsonar.projectKey=spacexp-sample-app \
                    -Dsonar.projectName="SpaceX Sample App" \
                    -Dsonar.sources=.
                '''
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    
                    echo "Pushing Docker image to Docker Hub..."
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }
        
        stage('Terraform Apply') {
            steps {
                // main.tf සහ variables.tf root එකේ ඇති නිසා වෙනම directory වෙනස් කිරීමක් අවශ්‍ය නොවේ
                sh 'terraform init'
                sh 'terraform apply -auto-approve'
            }
        }
    }
}
