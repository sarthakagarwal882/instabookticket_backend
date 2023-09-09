require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
client.connect();


async function insertData(data) {
    const db = client.db(process.env.DATABASE);
    const coll1 = db.collection(process.env.COLL1);
    const coll2 = db.collection(process.env.COLL2);
    const userSchema = {
        username: data.username,
        name: data.name,
        gender: data.gender,
        upcommingEvents: [],
        yourEvents: []
    }
    try {
        if (((await coll1.insertOne(data)).acknowledged) && ((await coll2.insertOne(userSchema)).acknowledged)) {
            return (true);
        }
        else {
            return (false)
        }
    }
    catch (err) {
    }
}


async function verifyToken(token) {
    // console.log(token);
    let tokenData = (jwt.verify(token, process.env.TOKEN, { expiresIn: 30, audience: process.env.JWT_AUD }, (err, decoded) => (decoded)
    ))
    if (tokenData === undefined)
        return (tokenData)
    else {
        try {
            let data = {
                username:tokenData.username

            }
            // console.log(tokenData.username);
            const db = client.db(process.env.DATABASE);
            const coll2 = db.collection(process.env.COLL2)
            const query = await coll2.findOne(data);
            // console.log(query);
            if (query._id.toString() == tokenData.token) {
                return(query);
            }
        }
        catch (err) {
            return (undefined)
        }
    }

}


async function checkLoginData(data) {
    const db = client.db(process.env.DATABASE);
    const coll1 = db.collection(process.env.COLL1);
    const coll2 = db.collection(process.env.COLL2)
    const data2 = { username: (data.username) }
    try {
        const query = await coll1.findOne(data);
        if (query == null) {
            return (false)
        }
        else {
            try {
                userData = await coll2.findOne(data2)
                console.log(userData);
                let expTime = '30 days'
                let token = jwt.sign({token:userData._id,username:userData.username}, process.env.TOKEN, { expiresIn: expTime, audience: process.env.JWT_AUD });
                let finalData = {
                    data: userData,
                    token: token,
                    expireTime: expTime,
                }
                return (finalData)
            }
            catch (error) {
                return (false)
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}


async function checkUsername(data) {
    const db = client.db(process.env.DATABASE);
    const coll1 = db.collection(process.env.COLL1);
    const coll2 = db.collection(process.env.COLL2);
    const check = await coll1.findOne({ username: data.username });
    if (check == null) {
        if ('name' in data) {
            if (await insertData(data)) {
                try {

                    let userData = (await coll2.findOne({ username: data.username }))
                    let expTime = '30 days'
                    var token = jwt.sign({token:userData._id,username:userData.username}, process.env.TOKEN, { expiresIn: expTime, audience: process.env.JWT_AUD });
                    let finalData = {
                        data: userData,
                        token: token,
                        expireTime: expTime
                    }
                    return (finalData)

                } catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            return false
        }
    }
    else {
        if ('name' in data)
            return false
        else
            return (check.salt);
    }
}


async function hashPass(message) {
    if ('name' in message) {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(message.password, salt)
        message.password = hashedPass
        message.salt = salt
        return (message)
    }
    else {
        const saltCheck = (await checkUsername(message))
        if (saltCheck === false)
            return (false)
        else {
            message.password = await bcrypt.hash(message.password, saltCheck)
            return (message)
        }
    }
}

function auth(app) {
    //Login post request
    app.post('/login', async (req, res) => {
        const message = req.body.credentials;
        const checkHash = await hashPass(message)
        if (checkHash === false) {
            {
                res.json(false)
            }
        }
        else {
            res.json(await checkLoginData(checkHash));
        }
    });

    //verification of token
    app.post('/verify', async (req, res) => {
        const message = req.body.cookieObj
        let check = await verifyToken(message.token)
        if (check === undefined)
            res.json('false')
        else
            res.json(check)

    });

    //Register post request
    app.post('/register', async (req, res) => {
        const message = req.body.formData;
        res.json(await checkUsername(await hashPass(message)));
    });
}



// async function del(data){
//   const db = client.db('FilmyRadar');
//   const coll = db.collection('UserCredentials');
//   const coll2 = db.collection('UserData');
//   await coll.deleteMany(data);
//   await coll2.deleteMany(data);
// }
module.exports = auth;