const express = require('express')
const axios = require('axios');
const msgMiddleware = require('../middleware/msgsend')
const userLog = require('../controller/userlog');

const router = express.Router();

const app = express();

app.use(express.json())

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
        // Process the data or update the UI as needed
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

// Endpoint to trigger the polling
router.get('/polling', async(req, res) => {
    const data = await pollServer();
    res.send(data);
});

router.get('/showUsers', userLog.currentUser)



module.exports = router;