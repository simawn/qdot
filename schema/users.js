const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usersSchema = new Schema({
    id:{
        type: Number
    },
    places:{
        type: Object
    },
    lattitude:{
        type: Number
    },
    longitude:{
        type: Number
    }
});

module.exports = mongoose.model('Users', usersSchema);
