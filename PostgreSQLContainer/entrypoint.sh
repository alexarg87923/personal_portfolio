#!/bin/bash
set -e

docker-entrypoint.sh postgres &

until pg_isready -h localhost -U postgres; do
    echo "Waiting for PostgreSQL to start..."
    sleep 2
done

psql -U postgres -d portfolio_db -f /psql_init_db/psql_init_part_2.sql

wait
