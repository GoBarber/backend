Use ```yarn dev:server```



For migrations use ```yarn typeorm migration:run```


Extra:
Create container: ```docker run --name gs11gobarber -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres```
Create migration: ```yarn typeorm migration:create -n AddAvatarField```
Check PID: ```sudo netstat -nlp | grep :5432```
