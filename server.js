const express = require('express');
const dbAPI = require('./data/dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.get('/updateRating/:placeId', (request, response) => {
    async function updateRating() {
        let bodyPlaceId = request.params.placeId;
        //let bodyUserId = request.params.userId;
        console.log(bodyPlaceId);
        //console.log(bodyUserId);
        let placeObject = await dbAPI.getPlaceData(bodyPlaceId);
        //console.log(placeObject);
        var calculatedNewRating = placeObject.placeRating * 1.10; //Increase by 10%
        var newRating = calculatedNewRating;
        if (calculatedNewRating >= 5) {
            newRating = 5;
        }

        let newPlaceObj = await dbAPI.updateRating(bodyPlaceId, newRating);
        console.log(newPlaceObj);
        let arrayObj = [newPlaceObj];
        //await dbAPI.addUserAlreadyRatedPlace(bodyUserId, bodyPlaceId);
        response.send(arrayObj);
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

app.get('/getPlace/:placeId', (req, res) => {
    async function getPlace(){
        let placeObj = await dbAPI.getPlaceData(req.params.placeId);
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
        await dbAPI.decreaseAllRatingsBy(0.1);
    }
    decrease();
}, 5000);

//Users can revote
/*
setInterval(() => {
    async function revote() {
        await dbAPI.clearVotePlaces();
    }
    revote();
}, 600000);
*/

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));