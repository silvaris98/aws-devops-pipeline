pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner' // ඔයාගේ Jenkins වල configured කර ඇති tool name එක අනුව මෙය වෙනස් විය හැක (අවශ්‍ය නම් පමණි)
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
                withSonarQubeEnv('SonarQube Server') {
                    // Jenkins credentials වලින් SonarQube token එක variable එකකට ලබා ගැනීම
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=spacexp-sample \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/node_modules/**,**/reports/** \
                            -Dsonar.coverage.exclusions=**/* \
                            -Dsonar.token=$SONAR_AUTH_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Run Integration (Docker + Selenium)') {
            steps {
                echo 'Running Integration Tests...'
                // ඔයාගේ integration tests කේතය මෙතැනට වැටේ
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                echo 'Building and pushing Docker image...'
                // Docker build & push කේතය මෙතැනට වැටේ
            }
        }

        stage('Terraform Deploy to AWS EC2') {
            steps {
                echo 'Deploying via Terraform...'
                // Terraform deploy කේතය මෙතැනට වැටේ
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
