const express = require('express');
const express = require('express');
const dbAPI = require('./dbAPI');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mock Server Running!');
});


let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));