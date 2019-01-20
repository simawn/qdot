const express = require('express');
const dbAPI = require('./data/dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.put('/updateRating', (request, response) => {
    async function updateRating() {
        let bodyPlaceId = request.body.placeId;
        let bodyUserId = request.body.userId;
        let bodyUserRating = request.body.userRating;

        let placeObject = await dbAPI.getPlaceData(bodyPlaceId);

        var currentPlaceRating = placeObject.placeRating;
        console.log(currentPlaceRating);
        var totalNumRatings = placeObject.placeNumberOfRatings;
        console.log(totalNumRatings);
        var newRating = (currentPlaceRating + bodyUserRating) / (totalNumRatings + 1);
        console.log(newRating);

        let newPlaceObj = await dbAPI.updateRating(bodyPlaceId, newRating);

        await dbAPI.addUserAlreadyRatedPlace(bodyUserId, bodyPlaceId);
        response.send(newPlaceObj);
    }
    updateRating();
});

app.post('/updateRating', (request, response) => {
    /*
        1. takes place name and returns a place object
        2. gets the user rating which is between 1-5
        3. place object contains the current rating and the number of people that have rated it
        4. process data to create new rating for the place and
        5. update the rating, and the places that the person has visited
    */
    async function updateRating() {
        let placeObject = await dbAPI.getPlaceData(request.body.placeName);
        let userRating = request.body.userRating;
        let userObject = await dbAPI.getUserData(request.body.userID);

        var currentRating = placeObject.placeRating;
        var totalRatings = placeObject.placeRating;

        var newRating = (currentRating + userRating) / (totalRatings + 1);


        await dbAPI.updateRating(placeObject.placeName, newRating);

        await dbAPI.addUserAlreadyRatedPlace(userObject._id, placeObject);
        response.send('Updated!');
    }
    updateRating();
});

app.get('/getAllPlaces', (req, res) => {
    async function getAllPlaces() {
        let allPlacesJSON = await dbAPI.getAllPlaceData();
        res.send(allPlacesJSON);
    }
    getAllPlaces();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));