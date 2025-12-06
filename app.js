const express = require('express');
const config = require('@config');
const { connectDB } = require('@database');
const { errorHandler, requestLogger } = require('@middleware');
const { sendSuccess } = require('@utils');

// Routes
const { userRoutes, authRoutes } = require('@routes');

const app = express();

// ============================================
// MIDDLEWARE SETUP (Pipeline)
// ============================================

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// ============================================
// DATABASE CONNECTION
// ============================================

connectDB();

// ============================================
// API ROUTES
// ============================================

// Health check route
app.get('/health', (req, res) => {
  sendSuccess(res, { status: 'Server is running', environment: config.NODE_ENV }, 'Health check');
});

// Welcome route
app.get('/', (req, res) => {
  sendSuccess(res, { version: config.API_VERSION }, 'Welcome to Betting API');
});

// User API Routes
app.use(`/api/${config.API_VERSION}/users`, userRoutes);

// Auth API Routes
app.use(`/api/${config.API_VERSION}/auth`, authRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  sendSuccess(res, null, 'Route not found', 404);
});

// ============================================
// GLOBAL ERROR HANDLER (Must be last)
// ============================================

app.use(errorHandler);

module.exports = app;
