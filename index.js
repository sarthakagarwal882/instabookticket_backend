require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require('./auth');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({
    origin: ['https://instabookticket.netlify.app','http://localhost:5173'],
    optionsSuccessStatus: 200
}))


let port = process.env.PORT
app.listen(8000 || port);


auth(app);
