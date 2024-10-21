# MealBase

A Project for managing your favorite recipes around the web.

### Move DB

Dump DB to directory
`mongodump --db <DB_NAME> --out <OUT_DIRECTORY>`

Restore

```sh
# copy directory into docker container
docker cp <LOCAL_PATH> <CONTAINER_id>:/tmp/mongodb

# restore db from file
mongorestore -d <DB_NAME> --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin <directory>
```

Example:

```sh
# Copy folder with db backup into docker image
docker cp /home/ec2-user/mealbase-lite/prod-2024-5-4 e34999e92524:/tmp/mongodb

# access shell inside container
docker exec -it e34999e92524 sh

# use restore command
mongorestore -d mealbase-prod --username admin --password P@ssw0rd! --authenticationDatabase admin /tmp/mongodb
```
