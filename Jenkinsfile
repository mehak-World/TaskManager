pipeline {
    agent {
        docker {
            image 'node:20'       // Node.js environment
            args '-u root:root'   // Optional: run as root to install packages if needed
        }
    }

    environment {
        DOCKER_IMAGE = "${DOCKER_USERNAME}/task-manager:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'credentialsId: '751b3571-c723-45fc-bbd1-ee1ff1d8b644'
', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
                sh 'docker push $DOCKER_IMAGE'
            }
        }
    }
}
