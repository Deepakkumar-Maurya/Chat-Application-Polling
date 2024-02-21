const db = require('../config/db')

// connecting database
db.connect((error)=> {
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to database in app');
    }
});

// Search user using email
const findUserWithEmail = (useremail, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [useremail], (error, result) => {
        if (error) {
            console.log(error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

// insert user in db
const insertUser = (username, useremail, hashedpassword, callback) => {
    db.query(
        'INSERT INTO users SET ?',
        { name: username, email: useremail, password: hashedpassword },
        (error, result) => {
            if (error) {
                console.log(error);
                callback(error, null);
            } else {
                callback(null, result);
            }
        }
    );
};

// show all users
const showUsers = (callback) => {
    db.query(`SELECT * FROM users`, (error, result) => {
        if(error) {
            console.log(error);
            callback(error, null);
        }
        else {
            callback(null, result);
        }
    })
}

// show particular user details
const showUserDetails = (userfriend, callback) => {
    db.query(`SELECT name, email FROM users WHERE name = ?`, [userfriend], (error, result) => {
        if (error) {
            console.log(error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
}

module.exports = { findUserWithEmail, insertUser, showUsers, showUserDetails }