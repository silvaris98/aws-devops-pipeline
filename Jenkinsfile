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
                // Unit tests run වී reports/TESTS-results.xml ෆයිල් එක ජෙනරේට් කරයි
                sh 'npm run unit'
            }
        }
        
        stage('Publish Test Results') {
            steps {
                // ජෙනරේට් වූ JUnit XML රිපෝට් එක Jenkins වෙත ලබා දීම
                junit 'reports/TESTS-results.xml'
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
                // ඔබේ structure එකේ ඇති test/terraform ෆෝල්ඩරය වෙත මාරු වී ක්‍රියාත්මක වේ
                dir('test/terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }
}
