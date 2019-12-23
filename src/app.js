const express = require('express');
var cors = require('cors')
const bodyParser = require("body-parser");
const app = express();
const router = require('./routes/routing');


app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

app.listen(process.env.PORT || 3000, function(){
    console.log(' Restful Api server started on: 3000');
})

