# Etapa 1: Construção do front-end
FROM node:20 AS build-front-end
WORKDIR /code/front-end

# Copie os arquivos de configuração do front-end
COPY code/front-end/package*.json ./

# Instale as dependências do front-end
RUN npm install

# Copie o restante dos arquivos de código do front-end
COPY code/front-end/ ./

# Execute o build do front-end
RUN npm run build

# Etapa 2: Construção do back-end
FROM ubuntu:latest AS build
WORKDIR /code/back-end
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install openjdk-21-jdk -y
RUN apt-get install -y maven

# Copiar o código do back-end para o contêiner
COPY code/back-end/ .

# Construir o projeto do back-end
RUN mvn clean install  

# Etapa 3: Imagem final
FROM openjdk:21-jdk-slim
WORKDIR /app

# Exponha as portas do front-end e do back-end
EXPOSE 3000 8080

# Copie o JAR gerado para a imagem final
COPY --from=build /code/back-end/target/*.jar app.jar

# Copie os arquivos do front-end para a imagem final
COPY --from=build-front-end /code/front-end/build/ /var/www/frontend/

# Instale um servidor para servir o front-end (por exemplo, serve)
RUN apt-get update && apt-get install -y npm && npm install -g serve

# Comando para rodar o back-end e servir o front-end
CMD bash -c "java -jar app.jar & serve -s /var/www/frontend -l 3000"
