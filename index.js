require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

// Setup CORS
app.use(cors());

// DB
dbConnection();

// Routes
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Hello',
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
