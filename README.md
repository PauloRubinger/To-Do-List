# To-Do List Application

This is a To-Do List application built with React.js for the front-end and Java Spring Boot for the back-end.

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Cloning & Initial Setup](#cloning--initial-setup)
4. [Backend Configuration](#backend-configuration)
5. [Running the Application](#running-the-application)
6. [Accessing the Application Locally](#accessing-the-application-locally)
7. [Running with Docker](#running-with-docker)

## Features
- Create, read, update, and delete task lists
- Create, read, update, and delete tasks within a task list

## Live Demo
The application is available at:

https://lds-8op7.onrender.com

The public deployment is already configured with its backend and Aurora DSQL database, so no local AWS or database setup is required to view the project. The public demo is read-only to protect the shared database. The Render free tier may take a few seconds to wake up after inactivity.

## Prerequisites
Make sure you have the following installed:
- Node.js 18+
- Java 21 JDK
- AWS CLI configured with access to the Aurora DSQL cluster (when applicable)
- A PostgreSQL-compatible database, such as local PostgreSQL or Aurora DSQL

> Never commit real database credentials to Git. Keep secrets in environment variables or a secrets manager.

## Cloning & Initial Setup

Clone the repository:
```bash
git clone https://github.com/PauloRubinger/To-Do-List.git
cd To-Do-List
```

## Backend Configuration

Before running the backend, you need to configure your local environment:

### 1. Create Backend Local Configuration

Navigate to the backend directory:
```bash
cd code/back-end
```

Create `application-local.properties` with your database configuration. The script `set-dsql-env.sh` will read this file to extract the endpoint and region.

**For Aurora DSQL:**
```bash
cat > src/main/resources/application-local.properties << 'EOF'
# Aurora DSQL Configuration
spring.datasource.url=jdbc:postgresql://<your-dsql-endpoint>:5432/postgres?sslmode=require
aws.region=your-region

# CORS for local network access
cors.allowed-origins=http://localhost:3000,http://<your-local-ip>:3000
EOF
```

**For Local PostgreSQL:**
```bash
cat > src/main/resources/application-local.properties << 'EOF'
spring.datasource.url=jdbc:postgresql://localhost:5432/todolist?sslmode=require
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>

cors.allowed-origins=http://localhost:3000
EOF
```

> This file is git-ignored and safe for storing credentials. Each developer should have their own local copy.

### 2. Create Frontend Local Configuration

In another terminal, navigate to the frontend directory:
```bash
cd code/front-end
cp .env.example .env.local
```

Update `.env.local` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:8080/api
```

> This file is git-ignored and can be safely modified for your local environment.

## Running the Application

### Starting the Backend

1. From `code/back-end` directory, build the project:
```bash
./mvnw clean install
```

2. Run the application with local profile (recommended):
```bash
./run-local.sh
```

This script automatically:
- Reads your `application-local.properties` for endpoint and region
- Generates Aurora DSQL temporary credentials (if using DSQL)
- Enables the `local` profile with CORS support

**Alternative: Manual execution**
```bash
source ./set-dsql-env.sh
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

### Starting the Frontend

In another terminal, from `code/front-end` directory:
```bash
npm install
npm start
```

The frontend will start on http://localhost:3000.

## Accessing the Application Locally
The application is configured to support access from different devices on your local network:

**From your machine (Desktop):**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api

**From mobile or other local machines (same network):**
- Identify your machine's local IP: `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux)
- Frontend: http://<YOUR_IP>:3000
- Backend: http://<YOUR_IP>:8080/api

**Important:** The backend must be running with the `local` profile to enable CORS for your IP address. Use `./run-local.sh` or the manual command shown in Step 6 above.

## Running with Docker
The Docker image builds the frontend and backend and uses Nginx to serve the frontend and proxy `/api` requests to Spring Boot.

The Docker image is intended for local execution and does not include database credentials. To run it, configure your own PostgreSQL or Aurora DSQL database and provide the required environment variables. The image enables read-only mode by default, matching the public demo. Do not use or request the credentials from the public demo deployment.

Build the image from the repository root:
```
docker build -t todolist-local .
```

Run the container using the AWS credentials available in the current terminal:
```
docker run --rm \
	-p 80:80 \
	-e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
	-e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
	-e AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN" \
	-e AWS_REGION=sa-east-1 \
	-e DSQL_CLUSTER_ENDPOINT="$DSQL_CLUSTER_ENDPOINT" \
	todolist-local
```

Open http://localhost. The container generates a temporary Aurora DSQL authentication token when it starts. The AWS credentials must have permission to generate the DSQL connection token, and temporary credentials must still be valid when the container starts. The DSQL token expires after approximately 15 minutes; restart the container to generate a new token.

For permanent AWS credentials, omit `AWS_SESSION_TOKEN` from the command. Never place credentials in the Dockerfile, README, or repository.

## Database Configuration Notes
- The project uses PostgreSQL via Spring Data JPA.
- The real connection values should come from environment variables, not committed files.
- The committed example file is safe because it uses placeholders and environment references only.
