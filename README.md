# Analytic Management System

## 🪜🔨 Development

1. Import to your browser for valid HTTPS connections `nginx/cert-local/ca.pem`.
2. Run docker-compose `docker-compose -f docker-compose.dev.yml up -d`
3. For frontend development `docker exec -it analytic-frontend bash`
   1. `npm install`
   2. `npm run dev`
   3. Open your browser [localhost](https://localhost/)
4. For backend development `docker exec -it analytic-api ash`
   1. `npm install`
   2. `./dev-server.sh`
   3. Open Swagger UI [localhost](https://localhost/api/open-api/docs)

### Databases

[adminer](http://127.0.0.1:8080/?pgsql=analytic-postgres&username=pg-user&db=pg-db)
[Redis Commander](http://127.0.0.1:8082/)

## 🚀 🎠 Production

```
export ASM_AUTH_HMAC_SECRET=`openssl rand -hex 32`
echo ASM_AUTH_HMAC_SECRET=$ASM_AUTH_HMAC_SECRET > .env


```

```
docker pull ghcr.io/artmarydotir/analytic-backend:latest

docker-compose up -d
```

### for tls connection to clickhouse-server:

put cert files in clickhouse-cert

- ca.pem
- client-fullchain.pem
- client-key.pem

### Databases Backup

backup:

```
-fc or -fp // fc is custom file name
docker exec analytic-postgres pg_dump -U pg-user -Fp pg-db
docker exec analytic-postgres pg_dump -U pg-user -Fp pg-db > /tmp/mary.sql


```

restore:

```
docker exec -it analytic-postgres psql -U pg-user -d template1 -c 'DROP DATABASE "pg-db" ;'
docker exec -it analytic-postgres psql -U pg-user -d template1 -c 'CREATE DATABASE "pg-db" ;'

if use fc switch in backup use pg_restore ->
cat /tmp/mary.sql | docker exec -i analytic-postgres pg_restore -U pg-user -d pg-db


```

<div>
  <p align="center">
    <img alt="aasaam software development group" width="64" src="https://raw.githubusercontent.com/aasaam/information/master/logo/aasaam.svg">
    <br />
    aasaam software development group
  </p>
</div>
