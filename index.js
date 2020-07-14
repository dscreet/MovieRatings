const express = require('express');
const request = require('request');
const app = express();
const mongoose = require('mongoose');
const movies = require('./routes/api/movies');

// DB configuration and connecting to mongo.
const db = require('./keys').mongoURI;
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs") // Makes ejs our view engine.
app.use('/', express.static('views')); // Makes css work with ejs.
app.use('/api/movies', movies);

// Renders the home page as default.
app.get("/", (req, res) => res.render("home"));

// Renders the movie results page.
app.get('/results', (req, res) => {
    const query = req.query.search; // Gets what the user typed.
    const url = 'http://www.omdbapi.com/?i=' + query + '&apikey='; // The omdb api has the info about the movie searched by the user.
    request(url, (error, response, body) => {

        if (!error && response.statusCode == 200) {

            let data = JSON.parse(body); // Gets data about the movie searched by the user.

            if (data.Response == "True") { // If the movie exists (shows up on the omdbapi)...

                    Movie.findOne({ id: data.imdbID }, (err, movie) => { // Checks if the movie the user searched for exists in our database.
                        
                        // Concatenates the data from the omdb api search with the data from our database.
                        try {
                            data = {...data,...movie.toObject()}; // toObject gets rid of the object properties.

                        } catch (e) {
                            console.log('error, not able to concatenate data.')
                        }    
                      
                    res.render('movieResults', { data: data }); // Renders the page that shows all the information (name, ratings, etc) about the queried movie.
                    });

            } else {
                res.render('error', { query });
            }
        } 
    })
});

// Renders the search results page.
app.get('/searchresults', (req, res) => {
    const query = req.query.search;
    const url = 'http://www.omdbapi.com/?s=' + query + '&apikey=';
    request(url, (error, response, body) => {

        if (!error && response.statusCode == 200) {

            let data = JSON.parse(body);

            // If omdb api comes up with results from the given query, list the page of movies that come up from that query.
            if (data.Response == "True") { 
                    res.render('searchResults', { data: data, query });

            } else {
                res.render('error', { query });
            }
        } 
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));