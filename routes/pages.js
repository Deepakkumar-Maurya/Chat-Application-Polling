const express = require('express')
const axios = require('axios');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const msgMiddleware = require('../middleware/msgsend')
const userLog = require('../controller/userlog');

const router = express.Router();

const app = express();

app.use(express.json())


dotenv.config();

// dotenv.config ({ path : './.env' });
const db = mysql2.createConnection({
    host : process.env.host ,
    user : process.env.user ,
    password : process.env.password ,
    database :process.env.database
});

db.connect((error)=> {
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to database in authenticate');
    }
});

const OneChatUserDetails = (userfriend) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name, email FROM users WHERE name = ?`, [userfriend], (error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                const details = result[0];
                resolve(details);
            }
        });
    });
};



const getMsgHistory = async() => {
    const response = await axios.get('http://localhost:5000/api/messages')
    // console.log(response.data);
    return response.data;
    // return response;
}



router.get('/',(req,res)=>{
    res.render("home");
});

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req,res) => {
    res.render('login');
})

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

router.post('/msgsend', msgMiddleware.isAuth ,msgMiddleware.sendMessage);





// Async function to perform the polling
const pollServer = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/messages');
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

router.get('/showUsers', msgMiddleware.isAuth, userLog.currentUser)
router.get('/showAllUsers', msgMiddleware.isAuth, userLog.allUser)


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

router.post('/OneChatMsgSend', msgMiddleware.isAuth ,msgMiddleware.OneChatSendMessage);

const OneChatPollServer = async (data) => {
    try {
        const response = await axios.get('http://localhost:5000/api/messages/OneChat', {params : data});
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

// Endpoint to trigger the polling
router.get('/OneChatPolling', msgMiddleware.isAuth, async(req, res) => {
    const data = await OneChatPollServer(req.body);
    res.send(data);
});







module.exports = router;