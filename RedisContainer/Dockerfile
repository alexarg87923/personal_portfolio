FROM redis:alpine

COPY ./redis.conf /usr/local/etc/redis/redis.conf
COPY ./users.acl /data/users.acl

EXPOSE 6379
ENTRYPOINT ["redis-server", "/usr/local/etc/redis/redis.conf"]
