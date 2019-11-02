const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

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
        res.redirect(`authors/${newAuthor.id}`);

    } catch {
        console.log('error name is empty');
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }

});

router.get('/:id', async (req, res) => {
    try {
        var author = await Author.findById(req.params.id);
        var books = await Book.find({
            author: author.id
        }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });

    } catch {
        res.redirect('/');
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        var author = await Author.findById(req.params.id);
        res.render('authors/edit', {
            author: author
        });
    } catch {
        res.redirect('/authors');
    }


});


router.put('/:id', async (req, res) => {
    var author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);

    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            });
        }
    }
});


router.delete('/:id', async (req, res) => {
    var author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors/');

    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
});


module.exports = router;