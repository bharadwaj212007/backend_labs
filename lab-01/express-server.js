
const express = require('express');

const app = express();

// Route 1: Home page
app.get('/', (req, res) => {
    res.send('Welcome to Node.js and Express Server!');
});

// Route 2: About page
app.get('/about', (req, res) => {
    res.json({
        name: 'DIVITI BHARADWAJ',
        section: 'AI&ML-2B'
    });
});

// Route 3: Current date and time
app.get('/time', (req, res) => {
    const currentTime = new Date();

    res.send({
        dateTime: currentTime
    });
});
// Handle unknown routes

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(3000, () => {
    console.log('Express server running on port 3000');
});
