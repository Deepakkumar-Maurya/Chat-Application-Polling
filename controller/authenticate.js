const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

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




const signup = async(req, res) => {
    const username = req.body.name;
    const useremail = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 12);
    console.log('signup')

    db.query(`SELECT * FROM users WHERE email = ?`,[useremail], (error, result) => {
        if(error) {
            console.log(error);
            res.send(error)
        }
        else if (result.length > 0) {
            console.log('email already registered!');
            res.send("email already registered!")
        }

        else {
            db.query('INSERT INTO users SET ?',{name : username, email : useremail , password : hashedpassword}, (error,result)=>{
                if(error){
                    console.log(error);
                    res.send(error)
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


const login = (req, res) => {
    let useremail = req.body.email;
    const password = req.body.password;

    if (!useremail || !password) {
        console.log("All fields are required");
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [useremail], async(error, result) => {
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
    });
};


const logout = (req,res) => {
    const errors = {}
    req.session.destroy((err) => {
        if(err) {
            // console.log(err);
            errors.logout = err;
            return res.status(400).json(errors);
        }
        else{
            // return res.status(200).json({success: true});
            return res.redirect('/');
        }
    });
}

module.exports = {signup, login, logout};
