# To-Do List Application

This is a To-Do List application built with React.js for the front-end and Java Spring Boot for the back-end.

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Ruuning the Application](#running-the-application)

## Features
- Create, read, update, and delete task lists
- Create, read, update, and delete tasks within a task list

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

## Database Configuration Notes
- The project uses PostgreSQL via Spring Data JPA.
- The real connection values should come from environment variables, not committed files.
- The committed example file is safe because it uses placeholders and environment references only.
