const express = require('express');
const router = express.Router();
const app = express();
const Movie = require('../../models/Movie');

// Gets all the movies from the database.
router.get('/', (req, res) => {
    try {
    Movie.find()
        .then(movies => {
           res.json(movies);
    })
} catch (e) {
    console.log(e);
}
});

// Creates and pushes a new movie object to the database.
router.post('/', (req, res) => {
    const newMovie = new Movie({
        id : req.body.id,
        name: req.body.name,
        sampleSize: req.body.sampleSize,
        rating: req.body.rating
    });

    newMovie.save().then(movie => res.json(movie));
});

// Deletes a movie object from the database.
router.delete('/:id', (req, res) => {
    Movie.findOneAndDelete({ id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

// Updates a movie object - changes the rating, sample size and timestamp of last updated.
router.put('/:id', (req, res) => {
    Movie.findOneAndUpdate({ id: req.params.id }, { rating: req.body.rating, sampleSize: req.body.sampleSize })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false}));
});

module.exports = router;