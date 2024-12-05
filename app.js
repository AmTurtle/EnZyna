const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// Set up Handlebars
app.engine('handlebars', exphbs.engine({
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/groups')
]);

// Serve static files
app.use(express.static('public'));

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res, next) => {
    try {
        res.render('home');
    } catch (err) {
        console.error('Error rendering home:', err);
        next(err);
    }
});

// Section routes
app.get('/lumera', (req, res) => {
    res.render('lumera');
});

app.get('/umbra', (req, res) => {
    res.render('umbra');
});

app.get('/stella', (req, res) => {
    res.render('stella');
});

app.get('/solis', (req, res) => {
    res.render('solis');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        path: err.path
    });
    res.status(500).render('error', { message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port} at http://localhost:${port}`);
});