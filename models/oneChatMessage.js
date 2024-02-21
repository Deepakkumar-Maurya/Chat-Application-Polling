const db = require('../config/db')

// connecting db
db.connect((error)=> {
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to database in app');
    }
});

// send new message to userfriend
const insertOneChatMessage = (username, userfriend, message, callback) => {
    db.query('INSERT INTO OneChatMessage SET ?',
        {sendername : username, receivername : userfriend, message : message},
         (error,result)=>{
        if(error){
            console.log("Error in sending message");
            callback(error, null);
        }
        else{
          callback(null, result);
        }
      })
}

// show all userfriend messages
const showOneChatMessage = (sendername, receivername, callback) => {
    const sql = `
        SELECT * 
        FROM OneChatMessage 
        WHERE (sendername = ? AND receivername = ?) 
            OR (receivername = ? AND sendername = ?)
        `;

    db.query(sql, [sendername, receivername, sendername, receivername], (error, result) => {
        if (error) {
            console.log(`Error in fetching messages: ${error}`);
            // res.status(500).json({ error: 'Internal Server Error' });
            callback(error, null);
        } else {
            // console.log(result);
            callback(null, result);
        }
    });
}

module.exports = { insertOneChatMessage, showOneChatMessage };