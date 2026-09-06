#!/bin/bash
# Local development script for Aurora DSQL with CORS support
# Starts the Spring Boot application with:
# - Automatic DSQL credential generation (15-minute tokens)
# - Local profile enabled (reads application-local.properties)
# - CORS configured for localhost and local network

set -e

echo "🚀 Starting To-Do List Backend (Local Mode)..."
echo ""
echo "Loading Aurora DSQL credentials..."
source ./set-dsql-env.sh

echo ""
echo "Starting Spring Boot with local profile..."
echo "   ✓ CORS enabled for localhost and local network (check application-local.properties)"
echo "   ✓ Database: Aurora DSQL (credentials expire in ~15 minutes)"
echo ""
echo "📱 Access from your machine:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api"
echo ""
echo "📱 Access from mobile/other machines on your network:"
echo "   Find your IP: ipconfig getifaddr en0  (macOS) or hostname -I (Linux)"
echo "   Then update application-local.properties with your IP"
echo ""

./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
