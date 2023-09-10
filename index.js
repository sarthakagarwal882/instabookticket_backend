//NPM packages
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios')
//js files
const auth = require('./auth');

//Code.
const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://instabookticket.netlify.app']
}));

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let port = process.env.PORT
app.listen(8000 || port);


auth(app);
