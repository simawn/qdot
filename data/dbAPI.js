const mongoose = require('mongoose');
const Places = require('../schema/places');
const Users = require('../schema/users');

mongoose.connect('mongodb://localhost/qdot', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
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
function updateRating(placeId, rating) {
    return new Promise((resolve, reject) => {
        Places.findOneAndUpdate({
            _id: placeId
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

function getPlaceData(placeId) {
    return new Promise((resolve, reject) => {
        Places.findOne({
            _id: placeId
        }).exec((err, result) => {
            if(err) reject(err);
            console.log(result);
            resolve(result);
        });
    });
}

function getAllPlaceData(){
    return new Promise((resolve, reject) => {
        Places.find({
            //Find all
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function addUser(userId, latitude, longitude){
    return new Promise((resolve, reject) => {
        new Users({
            id: userId,
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
            id: objId //Custom id search
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function addUserAlreadyRatedPlace(userId, placeId){
    return new Promise((resolve, reject) => {
        Users.findOneAndUpdate({
            _id: userId
        }
        ,{
            $push: { places: placeId }
        }
        ,{
            new: true
        }).exec((err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function decreaseAllRatingsBy(amount){
    Places.update({
        placeRating: {$gt: 1}
    }
    ,{
        $inc: { placeRating: -amount } 
    }).exec(() => {
        console.log("All ratings decreased by " + amount)
    });
}

function clearVotePlaces(){
    Users.update({
        //all
    }, {
        $pull: {places: {$exists: true}}
    }).exec(() => {
        console.log("All users can now revote")
    });
}

module.exports.addPlace = addPlace;
module.exports.updateRating = updateRating;
module.exports.getPlaceData = getPlaceData;
module.exports.addUser = addUser;
module.exports.getUserData = getUserData;
module.exports.addUserAlreadyRatedPlace = addUserAlreadyRatedPlace;
module.exports.getAllPlaceData = getAllPlaceData;
module.exports.decreaseAllRatingsBy = decreaseAllRatingsBy;
module.exports.clearVotePlaces = clearVotePlaces;
