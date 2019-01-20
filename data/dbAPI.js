const mongoose = require('mongoose');
const Places = require('../schema/places');
const Users = require('../schema/users');

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

function getPlaceData(placeName) {
    return new Promise((resolve, reject) => {
        Places.findOne({
            placeName: placeName
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function addUser(latitude, longitude){
    return new Promise((resolve, reject) => {
        new Users({
            id: 0,
            places: [],
            latitude: latitude,
            longitude: longitude
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function getUserData(objId){
    return new Promise((resolve, reject) => {
        Users.findOne({
            _id: objId
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function addUserAlreadyRatedPlace(userObjId, placeObj){
    return new Promise((resolve, reject) => {
        Users.findOneAndUpdate({
            _id: userObjId
        }
        ,{
            $push: { places: placeObj._id }
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

module.exports.addPlace = addPlace;
module.exports.updateRating = updateRating;
module.exports.getPlaceData = getPlaceData;
module.exports.addUser = addUser;
module.exports.getUserData = getUserData;
module.exports.addUserAlreadyRatedPlace = addUserAlreadyRatedPlace;
