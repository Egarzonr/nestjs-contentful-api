# Product API

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository.
2. Create a `.env` file in the root directory with the following variables:
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_ENVIRONMENT=master
   CONTENTFUL_CONTENT_TYPE=product
   JWT_SECRET=your_jwt_secret

3. Run `docker-compose up` to start the application.

## API Documentation

- Swagger UI is available at `http://localhost:3000/api/docs`.

## Running Tests

- Run `npm run test` to execute the unit tests.

## Linting

- Run `npm run lint` to check the code style.

## Contributing

- Please follow the conventional commit and gitflow guidelines.
