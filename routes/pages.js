const express = require('express')
const axios = require('axios');
const msgMiddleware = require('../middleware/msgsend')
const userLog = require('../controller/userlog');
const bodyParser = require('body-parser');
const userModel = require('../models/users');

const router = express.Router();

const app = express();

app.use(express.json());
app.use(bodyParser.json())

// function for getting userfriend details
const OneChatUserDetails = (userfriend) => {
    return new Promise((resolve, reject) => {
        userModel.showUserDetails(userfriend , (error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                const details = result[0];
                resolve(details);
            }
        })
    });
};


// function for getting message history
const getMsgHistory = async() => {
    const response = await axios.get('http://localhost:3000/api/messages/getMsg')
    // console.log(response.data);
    return response.data;
    // return response;
}


// route for home page
router.get('/',(req,res)=>{
    res.render("home");
});

// route for signup page
router.get('/signup', (req, res) => {
    res.render('signup');
})

// route for login page
router.get('/login', (req,res) => {
    res.render('login');
})

// route for chats page
router.get('/Chats', msgMiddleware.isAuth, async(req,res) => {
    try {
        const username = JSON.parse(req.session.jsonData).name;
            let msgHistory = await getMsgHistory();

            // console.log(msgHistory);
            res.render('Chats', { msgHistory, username }); 
    } catch (error) {
        console.error('Error fetching message history:', error);
        res.status(500).send('Internal Server Error');
    }
})

// route middleware for sending message
router.post('/msgsend', msgMiddleware.isAuth ,msgMiddleware.sendMessage);





// Async function to perform the polling
const pollServer = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/messages/getMsg');
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

// Endpoint to trigger the polling
router.get('/polling', msgMiddleware.isAuth, async(req, res) => {
    const data = await pollServer();
    res.send(data);
});

// route for showing connected users
router.get('/showUsers', msgMiddleware.isAuth, userLog.currentUser)
// route for showing all users
router.get('/showAllUsers', msgMiddleware.isAuth, userLog.allUser)

// route for OneChat page
router.get('/OneChat', msgMiddleware.isAuth, async (req, res) => {
    try {
        const username = JSON.parse(req.session.jsonData).name;
        const userfriend = req.query.user;
        console.log(userfriend);
        const userfriendDetails = await OneChatUserDetails(userfriend);
        console.log(userfriendDetails);
        res.render('OneChat', { username, userfriend, userfriendDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// route for sending messages to userfriend
router.post('/oneChatMsgSend', msgMiddleware.isAuth ,msgMiddleware.OneChatSendMessage);

// Async function to perform the polling
const OneChatPollServer = async (data) => {
    try {
        console.log("pollserver",data)
        const response = await axios.post('http://localhost:3000/api/messages/oneChatGetMsg', {data});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

// Endpoint to trigger the polling
router.post('/oneChatPolling',  async (req, res) => {
    try {
        console.log("blah")
        const data = req.body;
        console.log("Data=>", data);
        const result = await OneChatPollServer(data);
        res.send(result);
    } catch (error) {
        console.error('Error handling POST request:', error.message);
        res.status(500).send('Internal Server Error');
    }
});







module.exports = router;