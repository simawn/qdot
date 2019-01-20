const express = require('express');
const dbAPI = require('./data/dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/updateRating', (request, response) => {
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

app.get('/getAllPlaces', (req, res) => {
    async function getAllPlaces() {
        let allPlacesJSON = await dbAPI.getAllPlaceData();
        res.send(allPlacesJSON);
    }
    getAllPlaces();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));