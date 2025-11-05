FROM redis:alpine

COPY ./redis.conf /usr/local/etc/redis/redis.conf
COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 6379

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
