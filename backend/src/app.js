const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const statsRoutes = require('./routes/stats');

app.use(cors());
app.use(express.json());

// health
app.get('/', (req, res) => res.json({ ok: true, message: 'API Bibliothèque UAC' }));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/readers', require('./routes/readers'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/stats', statsRoutes);

module.exports = app;
