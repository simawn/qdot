const express = require('express');
const mongoose = require('mongoose');
const Places = require('../schema/places');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/qdot', { useNewUrlParser: true });
let db = mongoose.connection;

//Making sure database is connected and catching errors
db.once('open', () => {
    console.log('Database connected!');
});
db.on('error', (err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('Mock Server Running!');
});

/**
 * Add place to database
 * Body:
 * {
 *  placeName: "Polytechnique Montréal",
    placeAddress: "2900 Edouard Montpetit Blvd, Montreal, QC H3T 1J4",
    placeLatitude: 45.504384,
    placeLongitude: -73.6128829,
 * }
 */
app.post('/addPlace', (req, res) => {
    new Places({
        placeName: req.body.placeName,
        placeAddress: req.body.placeAddress,
        placeLatitude: req.body.placeLatitude,
        placeLongitude: req.body.placeLongitude
    }).save((err) => {
        res.send("Added");
        console.log(err);
    });
});

/**
 * Add place to database
 */
app.post('/sendRating', (req, res) => {

});

APIReturn1 = {
    placeName: "Polytechnique Montréal",
    placeAddress: "2900 Edouard Montpetit Blvd, Montreal, QC H3T 1J4",
    placeLatitude: 45.504384,
    placeLongitude: -73.6128829,
}

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
