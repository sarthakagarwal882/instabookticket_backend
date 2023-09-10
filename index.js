require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require('./auth');
const { default: axios } = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({
    origin: ['https://instabookticket.netlify.app', 'http://localhost:5173'],
    optionsSuccessStatus: 200
}))

let port = process.env.PORT
app.listen(8000 || port);


// function pingLink() {
//     const linkToPing = "https://instabook-backend.onrender.com/ping"; // Replace with the link you want to ping
//     let data = axios.get(linkToPing)
//     data.then(res => { })
// }

// // Ping the link every 10 minutes (10 minutes = 600,000 milliseconds)
// const pingInterval = 10 * 60 * 1000;
// setInterval(pingLink, pingInterval);

// app.get('/ping', (res) => { res.json('Ping Successfull') })

auth(app);
