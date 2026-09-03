# To-Do List Application

This is a To-Do List application built with React.js for the front-end and Java Spring Boot for the back-end.

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Running the Application](#running-the-application)
4. [Running with Docker](#running-with-docker)

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

## Running the Application
1. Clone the repository:
```
git clone https://github.com/PauloRubinger/To-Do-List.git
```
2. Navigate to the back-end directory:
```
cd code/back-end
```
3. Create the local runtime config file from the example:
```
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
4. For Aurora DSQL, use the script below to load the temporary credentials automatically without storing the token in the repository. The cluster endpoint and region are already configured in the script:
```
source ./set-dsql-env.sh
```
The script uses the AWS CLI session to generate a fresh token. Run `source ./set-dsql-env.sh` again when it expires.

If you need to override the default cluster endpoint, you can set it before calling the script:
```
export DSQL_CLUSTER_ENDPOINT="<cluster-endpoint>"
source ./set-dsql-env.sh
```

For a standard PostgreSQL instance, set the variables manually:
```
export SPRING_DATASOURCE_URL="jdbc:postgresql://<host>:5432/<database>?sslmode=require"
export SPRING_DATASOURCE_USERNAME="<username>"
export SPRING_DATASOURCE_PASSWORD="<password>"
```

5. Build the Spring Boot project:
```
./mvnw clean install
```
6. Run the Spring Boot application:
```
./mvnw spring-boot:run
```
7. Open a new terminal and navigate to the front-end directory:
```
cd ../front-end
```
8. Install dependencies:
```
npm install
```
9. Start the React application:
```
npm start
```
The front-end application will start on http://localhost:3000.

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
