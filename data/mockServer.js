const express = require('express');
const dbAPI = require('./dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mock Server Running!');
});

/**
 * Body:
{
  "placeName": "Polytechnique Montréal", 
  "placeAddress": "2900 Edouard Montpetit Blvd, Montreal, QC H3T 1J4", 
  "placeLatitude": 45.504384, 
  "placeLongitude": -73.6128822
}
 */
app.post('/api/addPlace', (req, res) => {
    async function addPlace(){
        let addPlaceReturn = await dbAPI.addPlace(req.body.placeName, req.body.placeAddress, req.body.placeLatitude, req.body.placeLongitude);
        res.send(addPlaceReturn);
    }
    addPlace();
});

/**
 * Body:
{
  "placeName": "Polytechnique Montréal", 
  "rating": 4
}
 */
app.post('/api/updateRating/', (req, res) => {
    async function updateRating(){
        let updateRatingReturn = await dbAPI.updateRating(req.body.place, req.body.rating);
        res.send(updateRatingReturn);
    }
    updateRating();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
