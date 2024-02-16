const express = require('express');
const mysql2= require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());

dotenv.config()
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
        console.log('Connected to database in server');
    }
});




app.use(bodyParser.json()); 

// Serve chat messages via API endpoint
app.get('/api/messages', (req, res) => {
  db.query(`SELECT * from messages`, (error, result) => {
    if (error) {
      console.log(`error in fetching messages ${error}`)
    }
    else {
      // console.log(result);
      res.json(result);
    }
  })
});

// Receive and store new chat messages
app.post('/api/messages', (req, res) => {
  const { username, message } = req.body;

  db.query('INSERT INTO messages SET ?',{name : username, message : message}, (error,result)=>{
    if(error){
        console.log(error);
        console.log("Error in sending message");
    }
    else{
      db.query(`SELECT * from messages`, (error, result) => {
        if (error) {
          console.log(`error in fetching messages ${error}`)
        }
        else {
          // console.log(result);
          res.json(result);
        }
      })
    }
  })
  
});

// ------------------------------------
app.post('/api/messages/OneChat', (req, res) => {
  const { username, userfriend, message } = req.body;

  db.query('INSERT INTO OneChatMessage SET ?',{sendername : username, receivername : userfriend, message : message}, (error,result)=>{
    if(error){
        console.log(error);
        console.log("Error in sending message");
    }
    else{
      db.query(`SELECT * FROM OneChatMessage WHERE sendername = ? AND receivername = ?`, [username, userfriend], (error, result) => {
        if (error) {
            console.log(`Error in fetching messages: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // console.log(result);
            res.json(result);
        }
      });
    }
  })
  
});

app.get('/api/messages/OneChat', (req, res) => {
  const { sendername, receivername } = req;
  db.query(`SELECT * FROM OneChatMessage WHERE sendername = ? AND receivername = ?`, [sendername, receivername], (error, result) => {
    if (error) {
        console.log(`Error in fetching messages: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        // console.log(result);
        res.json(result);
    }
  });
});








app.listen(port, () => {
  console.log(`api server is ruuning on ${port}`)
})
