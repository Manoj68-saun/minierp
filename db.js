//import pg from 'pg'
const {Client} = require('pg')
const dotenv = require ('dotenv')


dotenv.config()



const client=new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
})

//client.connect();



module.exports=client