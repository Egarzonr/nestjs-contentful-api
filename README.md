# Product API

This project is a backend API built with NestJS, MongoDB, and Docker. It periodically fetches product data from Contentful, stores it in a database, and provides public and private endpoints for interacting with the data.

## Installation & Setup

Clone the repository:

```sh
git clone <https://github.com/Egarzonr/nestjs-contentful-api>
cd <repository-folder>
```

### Configure the .env file

Use the .env.example to create an .env file in the root of the project with the following variables and replace them with the correct values:

```sh
MONGO_URI=mongodb://localhost:27017/product-api
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=your_environment
CONTENTFUL_CONTENT_TYPE=your_content_type
JWT_SECRET=your_jwt_secret

```

### Running Fully with Docker

To start both the app and the database with Docker, use:

```sh
   docker-compose up -d
```

### Running Locally with Docker

1. Start the MongoDB container:
   ```sh
   docker-compose up -d mongo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   npm run start:dev
   ```

## Scheduled Task

- A scheduled task runs every hour to fetch products from the Contentful API and store them in the database specified in the .env file.
- Important: The database must be populated before using the API. If you don’t want to wait for the scheduled task, you can manually trigger the fetch process using:

```sh
 `GET http://localhost:3000/contentful/fetch-products`
```

This endpoint performs the same function as the scheduled task.

## API Endpoints

### Public Endpoints

#### Products

- **Get products (paginated & filtered)**

  ```http
  GET http://localhost:3000/products?name=iPhone&category=Smartphone&minPrice=1000&maxPrice=1900
  ```

- **Delete Product**

  ```http
  DELETE http://localhost:3000/products/:id
  ```

#### Authentication and Users

- **Register a new user**
  ```http
  POST http://localhost:3000/users/register
  ```
  **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword",
    "roles": ["admin"]
  }
  ```
- **Login to get JWT Token**
  ```http
  POST http://localhost:3000/auth/login
  ```
  **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword"
  }
  ```
  **Response:**
  ```json
  {
    "access_token": "your_jwt_token"
  }
  ```

### Private Endpoints (Require JWT Token)

- **Get Reports deleted percentage of products**
  ```http
  GET http://localhost:3000/reports/deleted-percentage
  ```
  **Headers:**
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Get Reports deleted percentage of products**
  ```http
  GET http://localhost:3000/reports/non-deleted-percentage?hasPrice=true
  ```
  **Headers:**
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Get Reports top expensive products**
  ```http
  GET http://localhost:3000/reports/top-expensive-products
  ```
  **Headers:**
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

## Running Tests

To run tests with coverage:

```sh
npm run test -- --coverage
```

## CI/CD

- GitHub Actions is set up to run tests and linters on every push and pull request.
- Uses conventional commits and GitFlow.

## Documentation

- Swagger is available at: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
