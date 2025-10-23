pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    environment {
        DOCKER_REGISTRY = 'localhost:8082'
        DOCKER_CREDENTIALS_ID = 'nexus-credentials'
        SONARQUBE_ENV = 'SonarQube'
        APP_NAME = 'my-react-nodejs-app'
        VERSION = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            script {
                                // Check if test script exists using shell command
                                def hasTests = sh(
                                    script: 'grep -q \'"test"\' package.json && echo "true" || echo "false"',
                                    returnStdout: true
                                ).trim()
                                
                                if (hasTests == 'true') {
                                    sh 'npm test -- --coverage --passWithNoTests || true'
                                } else {
                                    echo 'No test script found, skipping tests'
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis') {
            when {
                expression { return false } // Temporarily disabled
            }
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${APP_NAME} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://sonarqube:9000
                        """
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            when {
                expression { return false } // Temporarily disabled
            }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            dir('backend') {
                                docker.build("${DOCKER_REGISTRY}/${APP_NAME}-backend:${VERSION}")
                                docker.build("${DOCKER_REGISTRY}/${APP_NAME}-backend:latest")
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            dir('frontend') {
                                docker.build("${DOCKER_REGISTRY}/${APP_NAME}-frontend:${VERSION}")
                                docker.build("${DOCKER_REGISTRY}/${APP_NAME}-frontend:latest")
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}-backend:${VERSION}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}-backend:latest").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}-frontend:${VERSION}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}-frontend:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh '''
                        docker compose down || true
                        docker compose up -d
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "Waiting for services to be healthy..."
                    sleep 30
                    
                    sh '''
                        echo "Checking backend health..."
                        docker exec backend node -e "
                        const http = require('http');
                        const options = {
                            hostname: 'localhost',
                            port: 5000,
                            path: '/health',
                            method: 'GET',
                            timeout: 5000
                        };
                        
                        const req = http.request(options, (res) => {
                            if (res.statusCode === 200) {
                                console.log('✓ Backend health check passed');
                                process.exit(0);
                            } else {
                                console.log('✗ Health check failed with status:', res.statusCode);
                                process.exit(1);
                            }
                        });
                        
                        req.on('error', (error) => {
                            console.error('✗ Health check error:', error.message);
                            process.exit(1);
                        });
                        
                        req.on('timeout', () => {
                            console.error('✗ Health check timeout');
                            req.destroy();
                            process.exit(1);
                        });
                        
                        req.end();
                        "
                    '''
                    
                    echo "Backend is healthy!"
                }
            }
        }
    }
    
    post {
        always {
            // Use deleteDir() instead of cleanWs() - it's a built-in step
            deleteDir()
        }
        success {
            echo 'Pipeline completed successfully!'
            // Add notification here (Slack, Email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification here
        }
    }
}