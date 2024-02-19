const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let msgHistory = [];
const sendMessage = async(req, res) => {
    
    const username = JSON.parse(req.session.jsonData).name; //take from db
    const message = req.body.newmsg;
    console.log(username,message);

    try {
        const response = await axios.post('http://localhost:3000/api/messages/sendMsg', { username, message })
        msgHistory = response.data;
        return res.redirect('/Chats');
    }
    catch(error) {
        console.log(`error occured ${error}`)
    }
}


let OneChatMsgHistory = [];
const OneChatSendMessage = async(req, res) => {
    
    const username = JSON.parse(req.session.jsonData).name; //take from db
    const message = req.body.newmsg;
    const userfriend = req.body.userfriend;

    try {
        const response = await axios.post('http://localhost:5000/api/messages/OneChat', { username, userfriend, message })
        OneChatMsgHistory = response.data;
        
        return res.redirect(`/OneChat?user=${encodeURIComponent(userfriend)}`);
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



module.exports = {isAuth, isNotAuth, sendMessage, OneChatSendMessage};