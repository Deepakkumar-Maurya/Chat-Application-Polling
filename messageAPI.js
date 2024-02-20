const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const messageModel = require('./models/messages');
const oneChatMessageModel = require('./models/oneChatMessage');


const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const router = express.Router();


app.use(bodyParser.json()); 

// Serve chat messages via API endpoint
router.get('/getMsg', (req, res) => {
  messageModel.showMessages((error, result) => {
    if (error) {
      console.log(`error in fetching messages ${error}`)
    }
    else {
      res.json(result);
    }
  })
});

// Receive and store new chat messages
router.post('/sendMsg', (req, res) => {
  const { username, message } = req.body;
  console.log("user",username)

  messageModel.insertMessage(username, message, (error, result) => {
    if (error) {
      console.log(`error in sending messages ${error}`)
    }
    else {
      messageModel.showMessages((error, result) => {
        if (error) {
          console.log(`error in fetching messages ${error}`)
        }
        else {
          res.json(result);
        }
      })
    }
  })
  
});

// ------------------------------------
router.post('/oneChatSendMsg', (req, res) => {
  const { username, userfriend, message } = req.body;

  oneChatMessageModel.insertOneChatMessage(username, userfriend, message, (error, result) => {
    if (error) {
      console.log(error);
      console.log("error in sending message");
    } else {
      oneChatMessageModel.showOneChatMessage(username, userfriend, (error, result) => {
        if (error) {
            console.log(`Error in fetching messages: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // console.log(result);
            res.json(result);
        }
      })
    }
  })
  
});

router.post('/oneChatGetMsg', (req, res) => {
  console.log(req.body)
  let userscred = req.body.data;
  const { sendername, receivername } = userscred;

oneChatMessageModel.showOneChatMessage(sendername, receivername, (error, result) => {
  if (error) {
      console.log(`Error in fetching messages: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
  } else {
      // console.log(result);
      res.json(result);
  }
})
});


module.exports = router;