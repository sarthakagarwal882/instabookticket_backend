//NPM packages
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');

//js files
const auth = require('./auth');
const { default: axios } = require('axios');

//Code.
const app = express();
app.use(cors({
  origin: ['http://localhost:5173','https://instabookticker.netlify.app','https://main--instabookticket.netlify.app','https://64f3919cf563cd00085f8d59--filmyradar.netlify.app'] // Replace with your frontend's origin
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
let port=process.env.PORT
app.listen(8000||port);

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
client.connect();

auth(app);

// function pingLink() {
//   const linkToPing = 'https://instabook-backend.onrender.com/'; // Replace with the link you want to ping
// let data=axios.get(linkToPing)
// data.then(res=>{})
// }

// // Ping the link every 10 minutes (10 minutes = 600,000 milliseconds)
// const pingInterval = 10*60*1000;
// setInterval(pingLink, pingInterval);