// index.js
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const eurekaClient = require('./config/eureka');
const { createUserTable } = require('./models/userModel');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Use the user routes
app.use('/', userRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

createUserTable();

// Register with Eureka
eurekaClient.start((error) => {
  if (error) {
    console.error('Failed to register with Eureka:', error);
  } else {
    console.log('Successfully registered with Eureka');
  }
});

// Deregister from Eureka on shutdown
process.on('SIGINT', () => {
  eurekaClient.stop((error) => {
    if (error) {
      console.error('Failed to deregister with Eureka:', error);
    } else {
      console.log('Successfully deregistered from Eureka');
    }
    process.exit();
  });
});