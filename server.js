const express = require('express');
const dbAPI = require('./data/dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mock Server Running!');
});



app.post('/updateRating', (request, response) => {
    /*
        1. takes place name and returns a place object
        2. gets the user rating which is between 1-5
        3. place object contains the current rating and the number of people that have rated it
        4. process data to create new rating for the place and
        5. update the rating, and the places that the person has visited
    */
   async function updateRating(){
    let placeObject = await dbAPI.getPlaceData(request.body.placeName);
    let userRating = request.body.userRating;
    let userObject = await dbAPI.getUserData(request.body.userID);

    var currentRating = placeObject.placeRating;
    var totalRatings = placeObject.placeRating;

    var newRating = (currentRating+userRating)/(totalRatings+1);


    await dbAPI.updateRating(placeObject.placeName, newRating);

    await dbAPI.addUserAlreadyRatedPlace(userObject._id, placeObject);
    response.send('Updated!');
   }
   updateRating();
});



let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));