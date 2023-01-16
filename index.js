require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

// Setup CORS
app.use(cors());

// Read and parse body
app.use(express.json());

// DB
dbConnection();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
