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
                    script {
                        // Jenkins environment එකෙන් ටෝකන් එක ෂෙල් ස්ක්‍රිප්ට් එකට නිවැරදිව ලබා දීම
                        def sonarToken = env.SONAR_TOKEN ?: ""
                        
                        sh """
                            echo "Waiting for SonarQube to be fully ready..."
                            RETRIES=15
                            COUNT=0
                            
                            while [ \$COUNT -lt \$RETRIES ]; do
                                # ටෝකන් එක භාවිත කරමින් සර්වර් ස්ටේටස් එක පරීක්ෂා කිරීම
                                if curl -sU "${sonarToken}:" http://16.171.137.199:9000/api/system/status | grep -q '"status":"UP"'; then
                                    echo "SonarQube is up and running!"
                                    break
                                fi
                                echo "SonarQube is starting up, sleeping for 10s..."
                                sleep 10
                                COUNT=\$((COUNT + 1))
                            done
                            
                            if [ \$COUNT -eq \$RETRIES ]; then
                                echo "Error: SonarQube failed to start within the expected time."
                                exit 1
                            fi
                        """
                    }
                    
                    // සෝනාර් ස්කෑනර් මෙවලම ක්‍රියාත්මක කිරීම
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
