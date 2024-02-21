const db = require('../config/db')

// database connection
db.connect((error)=> {
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to database in app');
    }
});

// show all logined users
const showSessions = (callback) => {
    db.query(`SELECT * FROM sessions`, (error, result) => {
        if(error) {
            console.log(error);
            callback(error, null);
        }
        else {
            callback(null, result);
        }
    })
}




module.exports = { showSessions }