const express = require('express');
const mysql2 = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const session = require("express-session");
const mysqlStore = require('express-mysql-session')(session);
const cors = require('cors');
const bodyParser = require('body-parser');


dotenv.config();

const app = express();
const port = 3000;
app.use(bodyParser.json());

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
        console.log('Connected to database in app');
    }
});

const sessionStore = new mysqlStore({},db);

app.use(session({
    key : 'my_session_key' ,
	secret : process.env.secret_key_session,
	store : sessionStore,
	resave : false,
	saveUninitialized : false,
    cookie : {maxAge : 60*60*1000}
}));

app.set('view engine', 'ejs');
app.use(cors());


const publicdirectory = path.join(__dirname, './public');
app.use(express.static(publicdirectory));

app.use(express.urlencoded({ extended : false }));

// routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'))
app.use('/api/messages', require('./messageAPI'));



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})