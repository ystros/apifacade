# apifacade
Provides policy validation and routing to a collection of services

# Setup
Clone project

Create a 'discovery' network
```
docker network create discovery
```

Go into the project work directory, build, and spin up service
```
cd [dev home]/apifacade
docker-compose build
docker-compose up -d
docker-compose logs
```

You should see the following
```
Attaching to api-facade
api-facade    | [2017-11-10T17:35:23.472Z] dev 913710a398b9 INFO: wait for app setup
api-facade    | [2017-11-10T17:35:24.475Z] dev 913710a398b9 INFO: Server running
```

Spin down the service when done
```
docker-compose down
```

# Test
Make sure the service is spun down
```
cd [dev home]/apifacade
docker-compose down
```

Run the facade unit tests
NOTE:  This step requires you have some version of node and npm installed on your host.
```
cd [dev home]/apifacade
npm test
```
