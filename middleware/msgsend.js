const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

let msgHistory = [];
const sendMessage = async(req, res) => {
    
    const username = JSON.parse(req.session.jsonData).name; //take from db
    const message = req.body.newmsg;

    try {
        const response = await axios.post('http://localhost:5000/api/messages', { username, message })
        msgHistory = response.data;
        return res.redirect('/Chats');
    }
    catch(error) {
        console.log(`error occured ${error}`)
    }
}

const isAuth = (req, res, next) => {
    // console.log(req.session);

    if (req.session && req.session.isAuth) {
        next();
    } else {
        return res.redirect('/login');
    }
};

const isNotAuth = (req, res, next) => {
    console.log('notAuth');
    // console.log(req.session);
    console.log("bbbbb")

    if (req.session && req.session.isAuth) {
        console.log('if');
        return res.redirect('/home');
    } else {
        next();
    }
};



module.exports = {isAuth, isNotAuth, sendMessage};