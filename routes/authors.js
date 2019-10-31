const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// All authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        var author = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: author,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }


});

// New author route
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    });
});

// Create author route
router.post('/', async (req, res) => {
    var author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        // res.redirect(`authors/${newAuthor.id}`);
        res.redirect('authors');

    } catch {
        console.log('error name is empty');
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }

});

module.exports = router;