### Setup: 
```
npm install
docker run --name db_fc -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=fider_community -p 5432:5432 -d postgres
yarn typeorm migration:run
```

### Run: 
```yarn dev:server```






Extra:
Create container: ```docker run --name db_fc -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=fider_community -p 5432:5432 -d postgres```

Stop and remove container: 
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

```

Checks database:
```
docker exec -it db_fc /bin/bash
psql -U postgres
\c fider_community
\dt
select * from migrations;
```

Migrate: ```yarn typeorm migration:run```

Create migration: ```yarn typeorm migration:create -n MigrationName```

Check PID: ```sudo netstat -nlp | grep :5432```
