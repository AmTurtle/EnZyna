const express = require('express');
const { marked } = require('marked');
const fs = require('fs-extra');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// Set up Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Serve static files
app.use(express.static('public'));

// Route to display article
app.get('/:article', async (req, res) => {
    try {
        const articlePath = path.join(__dirname, 'articles', `${req.params.article}.md`);
        console.log('Attempting to access article:', articlePath);
        const exists = await fs.pathExists(articlePath);
        console.log('Article exists:', exists);
        
        if (!exists) {
            console.log('Article not found, returning 404');
            return res.status(404).render('404', { message: 'Article not found' });
        }

        const content = await fs.readFile(articlePath, 'utf-8');
        const htmlContent = marked(content);
        
        res.render('article', {
            title: req.params.article,
            content: htmlContent
        });
    } catch (error) {
        console.error('Error serving article:', error);
        res.status(500).render('error', { message: error.message });
    }
});

// Route to display list of articles
app.get('/', async (req, res) => {
    try {
        const articles = await fs.readdir(path.join(__dirname, 'articles'));
        const articleList = articles
            .filter(file => file.endsWith('.md'))
            .map(file => ({
                name: file.replace('.md', ''),
                link: `/${file.replace('.md', '')}`
            }));
            
        res.render('home', { articles: articleList });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 