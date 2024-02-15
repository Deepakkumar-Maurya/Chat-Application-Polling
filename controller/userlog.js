const mysql2 = require('mysql2');
const dotenv = require('dotenv');

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


const currentUser = (req, res) => {
    db.query(`SELECT * FROM sessions`, (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            let userlist = [];
            result.forEach(user => {
                data = JSON.parse(user.data)
                jsonData = JSON.parse(data.jsonData)
                userlist.push(jsonData.name)
            })
            // console.log(userlist)
            res.send(userlist);
        }
    })
}

module.exports = { currentUser };