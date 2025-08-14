const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const errorHandler = require('./middleware/errorHandler');
const dailyTourCheck = require('./jobs/dailyTourCheck');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start cron job
dailyTourCheck();

// Routes
app.use('/api/applications', require('./routes/applications'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/users', require('./routes/users'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/ulb', require('./routes/ulb'));


// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Error handler
app.use(errorHandler);

/*app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});*/

//module.exports = app;