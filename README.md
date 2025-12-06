# Betting Backend - Project Structure

## Overview
This is a well-structured Express.js and MongoDB backend application with proper separation of concerns, environment management, and centralized response handling.

## Project Structure

```
betting-backend/
├── config/                 # Configuration files
│   └── environment.js     # Environment variables loader
├── database/              # Database related files
│   └── connection.js      # MongoDB connection handler
├── models/                # Database models
│   └── User.js           # User model schema
├── services/              # Business logic layer
│   └── userService.js    # User business logic
├── controllers/           # Request handlers
│   └── userController.js # User route handlers
├── routes/                # API route definitions
│   └── userRoutes.js     # User API routes
├── middleware/            # Custom middleware
│   ├── errorHandler.js   # Global error handler
│   └── requestLogger.js  # Request logging
├── utils/                 # Utility functions
│   └── response.js       # Centralized response handler
├── environments/          # Environment configuration
│   ├── .env              # Main env file
│   ├── .env.development  # Development config
│   ├── .env.staging      # Staging config
│   └── .env.production   # Production config
├── index.js              # Application entry point
└── package.json          # Project dependencies

```

## Environment Management

The application supports three environments with separate configurations:

### Development
```bash
npm run dev
```
- **Port**: 5000
- **Database**: Local MongoDB (mongodb://localhost:27017/betting_dev)
- **Log Level**: debug

### Staging
```bash
npm run staging
```
- **Port**: 5001
- **Database**: MongoDB Atlas staging cluster
- **Log Level**: info

### Production
```bash
npm run prod
```
- **Port**: 5002
- **Database**: MongoDB Atlas production cluster
- **Log Level**: error

## Architecture Overview

### 1. **Routes** (`/routes`)
Entry point for all API requests. Defines endpoints and routes to controllers.

```javascript
// Example: /api/v1/users
app.use(`/api/${config.API_VERSION}/users`, userRoutes);
```

### 2. **Controllers** (`/controllers`)
Handles HTTP requests and responses. Acts as the intermediary between routes and services.

```javascript
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```

### 3. **Services** (`/services`)
Contains all business logic. Independent of HTTP layer.

```javascript
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
```

### 4. **Models** (`/models`)
Defines MongoDB schema and data structure.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // ... other fields
});
```

### 5. **Database Connection** (`/database`)
Manages MongoDB connection initialization and disconnection.

```javascript
const connectDB = async () => {
  await mongoose.connect(config.MONGODB_URI);
};
```

### 6. **Response Handler** (`/utils/response.js`)
**All responses go through this centralized handler** for consistency.

```javascript
// Success response
sendSuccess(res, data, 'Message', 200);

// Error response
sendError(res, error, 'Error message', 400);

// Paginated response
sendPaginated(res, data, pagination, 'Message', 200);
```

### 7. **Error Handler** (`/middleware/errorHandler.js`)
**Centralized error handling** for all errors thrown in the application.

Handles:
- Mongoose validation errors
- Mongoose cast errors
- Duplicate key errors
- JWT errors
- Custom application errors

### 8. **Request Logger** (`/middleware/requestLogger.js`)
Logs all incoming requests with duration and status code.

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { /* response data */ },
  "timestamp": "2025-11-26T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "error": "Detailed error information",
  "timestamp": "2025-11-26T12:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  },
  "timestamp": "2025-11-26T12:00:00.000Z"
}
```

## API Endpoints

### Users
- `GET /api/v1/users` - Get all users (with pagination)
  - Query params: `page`, `limit`
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Adding New Features

### Step 1: Create Model
Create a new model file in `/models`:
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({ /* ... */ });
module.exports = mongoose.model('Product', productSchema);
```

### Step 2: Create Service
Create business logic in `/services`:
```javascript
// services/productService.js
const createProduct = async (data) => { /* ... */ };
module.exports = { createProduct, /* ... */ };
```

### Step 3: Create Controller
Handle requests in `/controllers`:
```javascript
// controllers/productController.js
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccess(res, product, 'Product created', 201);
  } catch (error) {
    next(error);
  }
};
```

### Step 4: Create Routes
Define endpoints in `/routes`:
```javascript
// routes/productRoutes.js
router.post('/', productController.createProduct);
```

### Step 5: Register Routes in Main App
In `index.js`:
```javascript
const productRoutes = require('./routes/productRoutes');
app.use(`/api/${config.API_VERSION}/products`, productRoutes);
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environments**:
   Update `.env.development`, `.env.staging`, and `.env.production` with your credentials.

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **MongoDB Setup**:
   - For local development: Ensure MongoDB is running on `localhost:27017`
   - For cloud: Update `MONGODB_URI` in environment files

## Error Handling

All errors are automatically caught and handled by the global error handler middleware. Simply throw errors in controllers or services, and they'll be properly formatted and returned to the client.

```javascript
// In controller
try {
  const user = await userService.getUserById(id);
} catch (error) {
  next(error); // Will be handled by errorHandler middleware
}
```

## Logging

Request logging is handled by the `requestLogger` middleware. Logs include:
- HTTP method
- Request URL
- Response status code
- Response time in milliseconds

## Best Practices

1. **Always use services for business logic** - Don't put logic in controllers
2. **Use the response handler** - Never send raw responses
3. **Throw errors in services** - Let middleware handle them
4. **Use try-catch in controllers** - Catch service errors and pass to error handler
5. **Keep models lean** - Only define schema and basic validations
6. **Environment variables** - Never hardcode sensitive data

## Development Workflow

1. Create model → service → controller → routes
2. All business logic goes in service
3. Controllers call services and return responses
4. Routes connect to controllers
5. Errors flow through middleware
