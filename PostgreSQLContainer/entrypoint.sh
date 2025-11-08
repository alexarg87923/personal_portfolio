#!/bin/bash
set -e

docker-entrypoint.sh postgres &

until pg_isready -h localhost -U "${POSTGRES_USER:-postgres}"; do
    echo "Waiting for PostgreSQL to start..."
    sleep 2
done

# Create database and admin user if they don't exist
if [ -n "$POSTGRES_DB" ]; then
    psql -U "${POSTGRES_USER:-postgres}" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || \
    psql -U "${POSTGRES_USER:-postgres}" -d postgres -c "CREATE DATABASE $POSTGRES_DB;"
fi

# Grant permissions to the postgres user (which is also the app user)
if [ -n "$POSTGRES_DB" ] && [ -n "$POSTGRES_USER" ]; then
    # Grant CONNECT privilege (idempotent - safe to run multiple times)
    psql -U "${POSTGRES_USER:-postgres}" -d postgres -c "GRANT CONNECT ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;" 2>/dev/null || true
fi

# Run schema initialization if database exists
if [ -n "$POSTGRES_DB" ]; then
    SCHEMA_NAME="${PSQL_SCHEMA:-personal_portfolio_schema}"
    
    # Ensure schema exists (idempotent - safe to run multiple times)
    psql -U "${POSTGRES_USER:-postgres}" -d "$POSTGRES_DB" <<EOF
CREATE SCHEMA IF NOT EXISTS $SCHEMA_NAME;
EOF

    # Grant permissions to the postgres user (which is also the app user)
    if [ -n "$POSTGRES_USER" ]; then
        psql -U "${POSTGRES_USER:-postgres}" -d "$POSTGRES_DB" <<EOF
-- Grant schema permissions (idempotent - safe to run multiple times)
GRANT USAGE, CREATE ON SCHEMA $SCHEMA_NAME TO $POSTGRES_USER;

-- Grant table permissions on existing tables (idempotent)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA $SCHEMA_NAME TO $POSTGRES_USER;

-- Set default privileges for future tables (idempotent)
ALTER DEFAULT PRIVILEGES IN SCHEMA $SCHEMA_NAME GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $POSTGRES_USER;
EOF
    fi
fi

wait
