FROM postgres:alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=mysecretpassword

COPY ./psql_init_part_1.sql /docker-entrypoint-initdb.d/psql_init_part_1.sql
COPY ./psql_init_part_2.sql /psql_init_db/psql_init_part_2.sql
COPY entrypoint.sh /entrypoint.sh

EXPOSE 5432

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
