#!/usr/bin/env bash

# Try to extract DSQL configuration from application-local.properties
LOCAL_PROPS="src/main/resources/application-local.properties"
if [ -f "$LOCAL_PROPS" ]; then
    # Extract endpoint from spring.datasource.url
    EXTRACTED_ENDPOINT=$(grep '^spring.datasource.url=' "$LOCAL_PROPS" 2>/dev/null | cut -d'=' -f2 | sed -E 's/.*:\/\/([^:]+):.*/\1/')
    if [ -n "$EXTRACTED_ENDPOINT" ] && [ "$EXTRACTED_ENDPOINT" != "your-endpoint-here" ]; then
        DSQL_CLUSTER_ENDPOINT="$EXTRACTED_ENDPOINT"
    fi
    
    # Extract AWS region from aws.region
    EXTRACTED_REGION=$(grep '^aws.region=' "$LOCAL_PROPS" 2>/dev/null | cut -d'=' -f2)
    if [ -n "$EXTRACTED_REGION" ]; then
        AWS_REGION="$EXTRACTED_REGION"
    fi
fi

DSQL_CLUSTER_ENDPOINT="${DSQL_CLUSTER_ENDPOINT:-your-endpoint-here}"
AWS_REGION="${AWS_REGION:-sa-east-1}"
SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-admin}"
DSQL_DATABASE="${DSQL_DATABASE:-postgres}"

if ! command -v aws >/dev/null 2>&1; then
    printf '%s\n' 'AWS CLI is required to generate the Aurora DSQL token.' >&2
    return 1 2>/dev/null || exit 1
fi

SPRING_DATASOURCE_PASSWORD="$(aws dsql generate-db-connect-admin-auth-token \
    --hostname "$DSQL_CLUSTER_ENDPOINT" \
    --region "$AWS_REGION" \
    --expires-in 900)" || {
    printf '%s\n' 'Could not generate the Aurora DSQL token.' >&2
    return 1 2>/dev/null || exit 1
}

export DSQL_CLUSTER_ENDPOINT
export AWS_REGION

# Only export SPRING_DATASOURCE_URL if endpoint is valid (not placeholder)
if [ "$DSQL_CLUSTER_ENDPOINT" != "your-endpoint-here" ]; then
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${DSQL_CLUSTER_ENDPOINT}:5432/${DSQL_DATABASE}?sslmode=require"
else
    unset SPRING_DATASOURCE_URL  # Remove any previous URL so application.properties default is used
fi
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD

printf '%s\n' 'Aurora DSQL credentials loaded (valid for up to 15 minutes).'