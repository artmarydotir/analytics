# Analytics

## Configurations

## Development

For development:

1. Import to your browser for valid HTTPS connections `nginx/cert-local/ca.pem`.
2. Run docker-compose `docker-compose -f docker-compose.dev.yml up -d`
3. For frontend development `docker exec -it analytic-frontend bash`
   1. `npm install`
   2. `npm run dev`
   3. Open your browser [localhost](https://localhost/)
4. For backend development `docker exec -it analytic-api bash`
   1. `npm install`
   2. `./dev-server.sh`
   3. Open Swagger UI [localhost](https://localhost/api/open-api/docs)
   4. Open GraphQL UI [localhost](https://localhost/api/graphql/docs)

### Databases

[adminer](http://127.0.0.1:8080/?pgsql=analytic-postgres&username=pg-user&db=pg-db)
[Redis Commander](http://127.0.0.1:8082/)

```
ALTER SEQUENCE users_id_seq RESTART;
UPDATE users SET id = DEFAULT;
```

docker exec -it analytic-redis redis-cli FLUSHALL

docker-compose -f docker-compose.prod.yml build --build-arg PROXY_HTTP=192.168.1.218:3390

<div>
  <p align="center">
    <img alt="aasaam software development group" width="64" src="https://raw.githubusercontent.com/aasaam/information/master/logo/aasaam.svg">
    <br />
    aasaam software development group
  </p>
</div>
