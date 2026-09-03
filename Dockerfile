# Multi-stage build
# Stage 1: build front-end
FROM node:20-alpine AS build-frontend
WORKDIR /src/front-end
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY code/front-end/package*.json ./
RUN npm ci --legacy-peer-deps
COPY code/front-end/ ./
RUN npm run build

# Stage 2: build back-end
FROM maven:3.9.5-eclipse-temurin-21 AS build-backend
WORKDIR /src/back-end
COPY code/back-end/ .
RUN mvn -B -DskipTests clean package

# Stage 3: runtime image
FROM eclipse-temurin:21-jdk-jammy
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app
ARG TARGETARCH

# Install runtime dependencies: nginx, AWS CLI, and curl for healthcheck
RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx ca-certificates curl unzip \
  && AWS_CLI_ARCH="${TARGETARCH:-amd64}" \
  && if [ "$AWS_CLI_ARCH" = "amd64" ]; then AWS_CLI_ARCH="x86_64"; fi \
  && if [ "$AWS_CLI_ARCH" = "arm64" ]; then AWS_CLI_ARCH="aarch64"; fi \
  && curl -fL "https://awscli.amazonaws.com/awscli-exe-linux-${AWS_CLI_ARCH}.zip" -o "awscliv2.zip" \
  && unzip -q awscliv2.zip \
  && ./aws/install \
  && rm -rf aws awscliv2.zip \
  && rm -rf /var/lib/apt/lists/*

# Copy backend JAR and the DSQL env helper script
COPY --from=build-backend /src/back-end/target/*.jar /app/app.jar
COPY code/back-end/set-dsql-env.sh /app/set-dsql-env.sh

# Copy frontend build into nginx www folder
COPY --from=build-frontend /src/front-end/build/ /var/www/html/

# Remove default nginx server config and add a simple one (serve static files)
RUN rm /etc/nginx/sites-enabled/default || true
RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /var/www/html;' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '  location /api/ {' \
  '    proxy_pass http://127.0.0.1:8080;' \
  '    proxy_set_header Host $host;' \
  '    proxy_set_header X-Real-IP $remote_addr;' \
  '    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
  '  }' \
  '}' > /etc/nginx/conf.d/todolist.conf

# Expose ports: 80 for frontend, 8080 for backend
EXPOSE 80 8080

# Use a small entrypoint script to start nginx and the Spring Boot app.
# If a DSQL cluster endpoint is provided, generate the temporary token before launch.
COPY <<'EOF' /app/entrypoint.sh
#!/bin/sh
set -e

# start nginx in background
nginx -g 'daemon on;'

if [ -z "${SPRING_DATASOURCE_URL:-}" ]; then
  . /app/set-dsql-env.sh
fi

# run the Spring Boot app with the API path expected by Nginx and the frontend
exec java -jar /app/app.jar --server.servlet.context-path=/api
EOF

RUN chmod +x /app/entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -fsS http://127.0.0.1:8080/api/taskList/listAll >/dev/null || exit 1

CMD ["/app/entrypoint.sh"]
