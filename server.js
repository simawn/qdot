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

        let placeObject = await dbAPI.getPlaceData(bodyPlaceId);

        var calculatedNewRating = placeObject.placeRating * 1.05; //Increase by 10%
        var newRating = calculatedNewRating;
        if (calculatedNewRating >= 5) {
            newRating = 5;
        }

        let newPlaceObj = await dbAPI.updateRating(bodyPlaceId, newRating);

        await dbAPI.addUserAlreadyRatedPlace(bodyUserId, bodyPlaceId);
        response.send(newPlaceObj);
    }
    updateRating();
});

app.get('/getAllPlaces', (req, res) => {
    async function getAllPlaces() {
        let allPlacesJSON = await dbAPI.getAllPlaceData();
        res.setHeader("Content-Type", "application/json");
        res.send(allPlacesJSON);
    }
    getAllPlaces();
});

app.post('/getPlace', (req, res) => {
    async function getPlace(){
        let placeObj = await dbAPI.getPlaceData(req.body.placeId);
        res.setHeader("Content-Type", "application/json");
        res.send(placeObj);
    }
    getPlace();
});

//Returns userObj if exists
app.post('/getUser', (req, res) => {
    async function getUser(){
        let userObj = await dbAPI.getUserData(res.body.userId);
        res.setHeader("Content-Type", "application/json");
        res.send(userObj);
    }
    getUser();
});

app.post('/addUser', (req, res) => {
    async function addUser(){
        let userObj = await dbAPI.addUser(res.body.userId, res.body.latitide, res.body.longitude);
        res.setHeader("Content-Type", "application/json");
        res.send(userObj);
    }
    addUser();
});

//Lit bar depletion.
setInterval(() => {
    async function decrease() {
        await dbAPI.decreaseAllRatingsBy(0.07);
    }
    decrease();
}, 300000);

//Users can revote
setInterval(() => {
    async function revote() {
        await dbAPI.clearVotePlaces();
    }
    revote();
}, 600000);

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));