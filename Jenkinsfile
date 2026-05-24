pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
    }

    environment {
        // Application configuration
        APP_NAME        = 'devops-portfolio'
        AWS_REGION      = 'us-east-1'
        
        // AWS ECR credentials & URL
        AWS_ACCOUNT_ID  = credentials('AWS_ACCOUNT_ID') // Expected to be configured in Jenkins Credentials
        REGISTRY_URL    = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        
        // Docker registry credential ID
        ECR_CREDENTIALS = 'aws-ecr-registry-credentials'
    }

    stages {
        stage('Initialize & Clean') {
            steps {
                echo 'Initializing environment...'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing packages...'
                sh 'npm ci'
            }
        }

        stage('Lint & Quality Check') {
            steps {
                echo 'Running ESLint...'
                // If lint fails, it breaks the build to protect quality
                sh 'npm run lint'
            }
        }

        stage('Build React Frontend') {
            steps {
                echo 'Compiling static bundle...'
                sh 'npm run build'
            }
        }

        stage('Dockerize Image') {
            steps {
                echo "Building Docker image ${APP_NAME}:latest..."
                script {
                    // Build local docker image
                    dockerImage = docker.build("${APP_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to Container Registry') {
            steps {
                echo 'Logging in to AWS ECR and pushing image...'
                script {
                    // Login to ECR and push the built image
                    // This block utilizes Jenkins Docker Pipeline Plugin
                    docker.withRegistry("https://${REGISTRY_URL}", "${ECR_CREDENTIALS}") {
                        dockerImage.push('latest')
                        dockerImage.push("${IMAGE_TAG}")
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying application container...'
                script {
                    // Example deployment using AWS ECS CLI or kubectl
                    // Option A: Rolling Update on ECS
                    sh "aws ecs update-service --cluster portfolio-cluster --service portfolio-service --force-new-deployment --region ${AWS_REGION}"
                    
                    // Option B: Kubernetes Apply
                    // sh "kubectl set image deployment/portfolio-deployment portfolio=${REGISTRY_URL}/${APP_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspaces and docker images...'
            // Clean local build images to avoid filling up the disk
            sh "docker rmi -f ${APP_NAME}:${IMAGE_TAG} || true"
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully. Deployment is live!'
            // Add Slack or Email notifications here
        }
        failure {
            echo 'Pipeline failed! Please check logs.'
            // Add Slack or Email notifications here
        }
    }
}
