const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The structure of each movie object.
const MovieSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    sampleSize: {
        type: Number,
        required: true
    }
},
{ timestamps: true } // Date/time of the creation and last update of the object.
);

module.exports = Movie = mongoose.model('movie', MovieSchema);