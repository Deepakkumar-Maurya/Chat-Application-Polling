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

// show message history
const showMessages = (callback) => {
    db.query(`SELECT * FROM messages`, (error, result) => {
        if(error) {
            console.log(error);
            callback(error, null);
        }
        else {
            callback(null, result);
        }
    })
}

// send new message to group
const insertMessage = (username, message, callback) => {
    db.query('INSERT INTO messages SET ?',{name : username, message : message}, (error,result)=>{
        if(error){
            console.log("Error in sending message");
            callback(error, null);
        }
        else{
          callback(null , result)
        }
      })
}



module.exports = { showMessages, insertMessage }