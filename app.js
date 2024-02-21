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

// database connection
const db = mysql2.createConnection({
    host : process.env.host ,
    user : process.env.user ,
    password : process.env.password ,
    database :process.env.database
});

// Connecting to the database
db.connect((error)=> {
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to database in app');
    }
});

// Creating a session store using MySQL
const sessionStore = new mysqlStore({},db);

// session middleware
app.use(session({
    key : 'my_session_key' ,
	secret : process.env.secret_key_session,
	store : sessionStore,
	resave : false,
	saveUninitialized : false,
    cookie : {maxAge : 60*60*1000}
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(cors());

// Serve static files from the 'public' directory
const publicdirectory = path.join(__dirname, './public');
app.use(express.static(publicdirectory));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended : false }));

// routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'))
app.use('/api/messages', require('./messageAPI'));


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})