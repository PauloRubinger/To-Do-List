FROM ubuntu:latest AS build
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install openjdk-21-jdk -y
RUN apt-get install -y maven
COPY . .
ENV URL=dpg-cp0jv7021fec73868ab0-a.oregon-postgres.render.com
ENV PORT=5432
ENV POSTGRES_DB=todolist_0zd3
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=THzNIchDx4yNh8up5iUeWyubsZOjEPuc
RUN mvn clean install -e
FROM openjdk:21-jdk-slim
EXPOSE 8080
COPY --from=build target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]