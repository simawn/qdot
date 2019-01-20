const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let placesSchema = new Schema({
    placeName:{
        type: String
    },
    placeAddress:{
        type: String
    },
    placeLatitude:{
        type: Number
    },
    placeLongitude:{
        type: Number
    },
    placeRadius:{
        type: Number,
        default: 12
    },
    placeRating:{
        type: Number,
        default: 0
    },
    placeNumberOfRatings:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Places', placesSchema);
