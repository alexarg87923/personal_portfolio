FROM postgres:alpine

# Environment variables will be provided at runtime via docker-compose
# POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB are standard PostgreSQL env vars

COPY ./psql_init.sql /docker-entrypoint-initdb.d/psql_init.sql
COPY entrypoint.sh /entrypoint.sh

EXPOSE 5432

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
