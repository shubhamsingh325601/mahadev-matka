const swaggerJSDoc = require('swagger-jsdoc');
const config = require('./environment');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bating Backend API Documentation',
    version: config.API_VERSION,
    description:
      'This is the API documentation for the Bating Backend application. It provides endpoints for user management and authentication.',
    contact: {
      name: 'Shubham Singh',
      email: 'your.email@example.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './models/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
