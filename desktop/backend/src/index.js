const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailRoutes = require('./routes/email');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Email client backend running on port ${PORT}`);
});
