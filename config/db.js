const mysql2 = require('mysql2')
const dotenv = require('dotenv');

dotenv.config();

const db = mysql2.createConnection({
    host : process.env.host ,
    user : process.env.user ,
    password : process.env.password ,
    database :process.env.database
});

module.exports = db;