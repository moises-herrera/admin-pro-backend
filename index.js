require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

// Setup CORS
app.use(cors());

// Public folder
app.use(express.static('public'));

// Read and parse body
app.use(express.json());

// DB
dbConnection();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/all', require('./routes/searches'));
app.use('/api/upload', require('./routes/uploads'));

// Handle routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
