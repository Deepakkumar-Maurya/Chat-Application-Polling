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
  // res.json(messages);
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
  // console.log(req.body);
  // const username = req.body.msgdata;
  // const message = req.body.msgdata;
  const { username, message } = req.body;
  
  // const newMessage = { user, message };
  // messages.push(newMessage);

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

app.listen(port, () => {
  console.log(`api server is ruuning on ${port}`)
})
