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
                withSonarQubeEnv('SonarQube Server') {
                    echo "Bypassing SonarQube readiness check and running scanner directly..."
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
