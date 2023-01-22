# Financial Manager API

## Installation

1. Install dependencies (in "/api" folder):

```cmd
cd api
npm install
```

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

2. Go to http://localhost:8080/swagger

## Testing

1. Run database docker container (in root project folder):

```cmd
docker-compose up postgres
```

2. Run npm script:

```cmd
npm run test
```

## Development

1. Run database docker container (in root project folder):

```cmd
docker-compose up postgres
```

2. Run npm script:

```cmd
npm run dev
```
