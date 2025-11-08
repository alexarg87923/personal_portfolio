#!/bin/sh
set -e

# Generate users.acl file from environment variables
REDIS_USER="${REDIS_USER:-alexportfolio}"
REDIS_PASSWORD="${REDIS_PASSWORD:-pass}"
REDIS_PREFIX="${REDIS_PREFIX:-portfolio:}"

mkdir -p /data

# Create users.acl file dynamically
cat > /data/users.acl <<EOF
user ${REDIS_USER} on >${REDIS_PASSWORD} ~${REDIS_PREFIX}* +@all
user healthcheck on nopass ~* &* -@all +ping
user default off
EOF

echo "Generated Redis ACL file with user: ${REDIS_USER}, prefix: ${REDIS_PREFIX}"

# Start Redis server
exec redis-server /usr/local/etc/redis/redis.conf

