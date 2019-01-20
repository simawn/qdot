const express = require('express');
const snapMap = require('../lib');
const app = express();

  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://localhost:27017/";

  const mongoose = require('mongoose');

//Set up default mongoose connection
    var mongoDB = 'mongodb://127.0.0.1/my_database';
    mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
//Get the default connection
    var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
