# Financial Manager API

## Production

Build and run all docker containers (in root project folder):

```cmd
docker-compose build
docker-compose up
```

## Swagger Documentation

1. Build and run all docker containers (in root project folder):

```cmd
docker-compose build
docker-compose up
```

Also you can start only database docker container and get up development server.

2. Go to http://localhost:8080/swagger

## Testing

**Coverage: 99%**

1. Install dependencies (in "/api" folder):

```cmd
cd api
npm install
```

2. Run database docker container (in root project folder):

```cmd
docker-compose up postgres
```

3. Run npm script:

```cmd
npm run test
```

## Development

1. Install dependencies (in "/api" folder):

```cmd
cd api
npm install
```

2. Run database docker container (in root project folder):

```cmd
docker-compose up postgres
```

3. Run npm script:

```cmd
npm run dev
```
