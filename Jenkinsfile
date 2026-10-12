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
                
                // සෙලේනියම් ටෙස්ට් එක සඳහා Selenium Standalone Server එක පසුබිමින් ස්ටාර්ට් කිරීම
                // (ඔබ සර්වර් එකේ selenium-server.jar දමා ඇත්නම් හෝ ඩොකර් කන්ටේනර් එකක් ලෙස ක්‍රියාත්මක කරන්නේ නම් මෙතැනින් හැසිරවිය හැක)
                script {
                    sh 'nohup java -jar /opt/selenium-server.jar standalone &>/dev/null & '
                    // සර්වර් එක ස්ටාර්ට් වීමට තත්පර කිහිපයක් ලබා දීම
                    sleep 5
                }
                
                // Unit / UI tests run වීම සහ JUnit XML report ජෙනරේට් වීම
                sh 'npm run unit'
            }
        }
        
        stage('Publish Test Results') {
            steps {
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
                dir('test/terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }
}
