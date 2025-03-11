# Product API

This project is a backend API built with NestJS, MongoDB, and Docker. It periodically fetches product data from Contentful, stores it in a database, and provides public and private endpoints for interacting with the data.

## 📌 Installation & Setup

Clone the repository:

```sh
git clone https://github.com/Egarzonr/nestjs-contentful-api
cd nestjs-contentful-api
```

### ⚙️ Configure the .env file

Use the `.env.example` to create an `.env` file in the root of the project with the following variables, replacing them with the correct values:

```sh
MONGO_URI=mongodb://localhost:27017/product-api
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=your_environment
CONTENTFUL_CONTENT_TYPE=your_content_type
JWT_SECRET=your_jwt_secret
```

### 🐳 Running with Docker (Recommended)

To start both the app and the database with Docker, use:

```sh
docker-compose up -d
```

### 🖥️ Running Locally with Docker

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

---

## ⏳ **Scheduled Task (Fetching Products from Contentful)**

- A **scheduled task** runs **every hour** to fetch products from Contentful and store them in the database specified in the `.env` file.
- ⚠️ **Important**: The database must be populated before using the API.  
  If you don’t want to wait for the scheduled task, you can **manually trigger** the fetch process using:

  ```http
  GET http://localhost:3000/contentful/fetch-products
  ```

  **This endpoint performs the same action as the scheduled task (cron job).**

---

## 📩 **Postman Collection**

You can find a Postman collection with all API endpoints in the `postman/` folder.  
Download and import it into Postman to test the API easily.

- **Collection file:** [`postman/contentful-API.postman_collection.json`](postman/contentful-API.postman_collection.json)
- **How to use it?**
  1. Open Postman.
  2. Click on `Import`.
  3. Select the `contentful-API.postman_collection.json` file.
  4. Start testing the API! 🚀

---

## 🌍 **API Endpoints**

### 🔓 Public Endpoints

#### 🛒 Products

- **Get products (paginated & filtered)**

  ```http
  GET http://localhost:3000/products?name=iPhone&category=Smartphone&minPrice=1000&maxPrice=1900
  ```

- **Delete Product**
  ```http
  DELETE http://localhost:3000/products/:id
  ```

#### 👨Authentication & Users

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

---

### 🔐 **Private Endpoints (Require JWT Token)**

#### 📊 Reports

- **Percentage of deleted products**

  ```http
  GET http://localhost:3000/reports/deleted-percentage
  ```

  **Headers:**

  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

- **Percentage of non-deleted products with optional filters**

  ```http
  GET http://localhost:3000/reports/non-deleted-percentage?hasPrice=true
  ```

  - **Filters**:
    - `hasPrice=true`: Only products **with a price**.
    - `hasPrice=false`: Only products **without a price**.
    - `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`: Filter by creation date.

  **Headers:**

  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

- **Top 5 most expensive products**
  ```http
  GET http://localhost:3000/reports/top-expensive-products
  ```
  **Headers:**
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

---

## 🧪 **Running Tests**

To run tests with coverage:

```sh
npm run test -- --coverage
```

---

## 🚀 **CI/CD Pipeline**

- **GitHub Actions** runs tests and linters on every push and pull request.
- Follows **conventional commits** and **GitFlow**.

---

## 📝 **API Documentation**

- **Swagger UI** available at:  
  [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
