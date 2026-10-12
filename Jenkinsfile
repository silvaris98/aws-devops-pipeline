pipeline {
    agent any
    
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
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh 'sonar-scanner -Dsonar.host.url=http://16.171.137.199:9000 -Dsonar.login=${SONAR_TOKEN}'
                }
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    // ඔබගේ ඩොකර් සාර්ථකව බිල්ඩ් කර පුෂ් කිරීම සඳහා මෙහි විධාන යොදන්න
                    // උදාහරණයක් ලෙස:
                    // sh 'docker build -t your-docker-image . '
                    // sh 'docker push your-docker-image'
                    echo "Docker build and push stage..."
                }
            }
        }
        
        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }
}
