//NPM packages
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios=require('axios')
//js files
const auth = require('./auth');

//Code.
const app = express();
app.use(cors({
    origin: ['http://localhost:5173/', 'https://instabookticket.netlify.app/']
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let port = process.env.PORT
app.listen(8000 || port);


auth(app);
app.get('/', (res) => { })

function pingLink() {
    const linkToPing = 'https://instabook-backend.onrender.com'; // Replace with the link you want to ping
    let data = axios.get(linkToPing+'/')
    data.then(res => { })
}

// Ping the link every 10 minutes (10 minutes = 600,000 milliseconds)
const pingInterval = 10 * 60 * 1000;
setInterval(pingLink, pingInterval);