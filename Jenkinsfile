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
                    // SONAR_TOKEN එක environment variable එක හරහා සෘජුවම sonar-scanner වෙත ලබා දීම
                    sh 'sonar-scanner -Dsonar.host.url=http://16.171.137.199:9000 -Dsonar.login=${SONAR_TOKEN}'
                }
            }
        }
    }
}
