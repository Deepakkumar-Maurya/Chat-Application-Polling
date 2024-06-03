const userModel = require('../models/users');
const bcrypt = require('bcrypt');

// controller for sign up
const signup = async(req, res) => {
    const username = req.body.name;
    const useremail = req.body.email;
    const password = req.body.password;

    // validate the data
    if (!username ||!useremail ||!password) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required',
        });
    }
    if (useremail.indexOf('@') === -1) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email',
        });
    }

    const hashedpassword = await bcrypt.hash(password, 12);
    console.log('signup')

    userModel.findUserWithEmail(useremail, (error, result) => {
        if(error) {
            console.log(error);
            res.json({
                error: error.message,
                success: false
            })
        }
        else if (result.length > 0) {
            console.log('email already registered!');
            res.json({ message: "email already registered!" })
        }
        else {
            userModel.insertUser(username, useremail, hashedpassword, (error, result) => {
                if(error){
                    console.log(error);
                    res.json({
                        error: error.message,
                        success: false
                    })
                }
                else{
                    //console.log(result);
                    // return res.status(200).json({success: true})
                    return res.redirect('/login',
                    // { message: 'User Registerd'}
                    );
                }
            })
        }
    })
}

// controller for login
const login = (req, res) => {
    let useremail = req.body.email;
    const password = req.body.password;

    if (!useremail || !password) {
        console.log("All fields are required");
        return res.status(400).json({ error: 'All fields are required' });
    }

    userModel.findUserWithEmail(useremail, async(error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.length === 0) {
            console.log('No such user found');
            return res.status(404).json({ error: 'No such user found' });
        } else {

            // const storedPassword = result[0].password;
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const username = result[0].name;

            const data = { 
                name: result[0].name, 
                email: result[0].email,
            };

            const jsonData = JSON.stringify(data);
            req.session.jsonData = jsonData;
            req.session.isAuth = true;
            // console.log("here");
            // console.log(req.session)
            // console.log(req.session.username);
            return res.redirect('/Chats');
        }
    })
};

// controller for logout
const logout = (req,res) => {
    const errors = {}
    req.session.destroy((err) => {
        if(err) {
            // console.log(err);
            errors.logout = err;
            return res.status(400).json({
                error: errors.message,
                success: false
            });
        }
        else{
            // return res.status(200).json({success: true});
            return res.redirect('/');
        }
    });
}

module.exports = {signup, login, logout};
