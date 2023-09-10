require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require('./auth');
const { default: axios } = require('axios');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({
    origin: ['https://instabookticket.netlify.app', 'http://localhost:5173'],
    optionsSuccessStatus: 200
}))

let port = process.env.PORT
app.listen(8000 || port);


async function pingLink() {
    try{
        const linkToPing = "https://instabook-backend.onrender.com/ping"; // Replace with the link you want to ping
        let data =await axios.get(linkToPing)
    }
    catch(e){
        console.log('e');
    }
}

// Ping the link every 10 minutes (10 minutes = 600,000 milliseconds)
const pingInterval = 1000*60*10;
setInterval(pingLink, pingInterval);

app.get('/ping', (req,res) => { res.json('Ping Successfull') })

auth(app);
