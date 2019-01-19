const mongoose = require('mongoose');
const Places = require('../schema/places');

mongoose.connect('mongodb://localhost/qdot', { useNewUrlParser: true });
let db = mongoose.connection;

//Making sure database is connected and catching errors
db.once('open', () => {
    console.log('Database connected!');
});
db.on('error', (err) => {
    console.log(err);
});

function addPlace(placeName, placeAddress, placeLatitude, placeLongitude, placeRadius, placeRating, placeNumberOfRatings) {
    //console.log(`${placeName}, ${placeAddress}, ${placeLatitude}, ${placeLongitude}, ${placeRadius}, ${placeRating}, ${placeNumberOfRatings}`);    
    return new Promise((resolve, reject) => {
        new Places({
            placeName: placeName,
            placeAddress: placeAddress,
            placeLatitude: placeLatitude,
            placeLongitude: placeLongitude,
            placeRadius: placeRadius,
            placeRating: placeRating,
            placeNumberOfRatings
        }).save((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

//This function literaly replaces the current rating. Does not do any calculations.
function updateRating(placeName, rating) {
    return new Promise((resolve, reject) => {
        Places.findOneAndUpdate({
            placeName: placeName
        }
        ,{
            placeRating: rating
        }
        ,{
            new: true
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function getRating(placeName) {
    console.log("getRating called!" + check);
    return "getRating";
}

function getNumberOfRatings(placeName) {
    return "getNumberOfRatings";
}

module.exports.addPlace = addPlace;
module.exports.updateRating = updateRating;
