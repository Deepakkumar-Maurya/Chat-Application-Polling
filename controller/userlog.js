const sessionModel = require('../models/sessions'); 
const userModel = require('../models/users');

// controller for fetching current logined users
const currentUser = (req, res) => {
    sessionModel.showSessions((error, result) => {
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

// controller for fetching all registered users
const allUser = (req, res) => {
    userModel.showUsers((error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            let alluserlist = [];
            result.forEach(user => {
                alluserlist.push(user.name)
            })
            // console.log(userlist)
            res.send(alluserlist);
        }
    })
}



module.exports = { currentUser, allUser };