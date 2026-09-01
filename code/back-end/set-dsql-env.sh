#!/usr/bin/env bash

DSQL_CLUSTER_ENDPOINT="${DSQL_CLUSTER_ENDPOINT:-ejuayk643wrz37cfavw5qrnh7m.dsql.sa-east-1.on.aws}"
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
export SPRING_DATASOURCE_URL="jdbc:postgresql://${DSQL_CLUSTER_ENDPOINT}:5432/${DSQL_DATABASE}?sslmode=require"
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD

printf '%s\n' 'Aurora DSQL credentials loaded (valid for up to 15 minutes).'