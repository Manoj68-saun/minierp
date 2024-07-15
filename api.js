// //const client = require('./connection.js')

// const express =require('express')
// const app=express()
// const cors= require('cors')
// const http= require('http')
// const bodyParser= require('body-parser');
// const {Client} = require('pg')
// const dotenv = require('dotenv');
// const db = require('./db');
// dotenv.config({ path: './config.env' });
// const path = require('path');
// // middleware
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// const port=8080;
// let client;
//  client =  new Client({
//  user: process.env.DB_USERNAME,
    
//  password: process.env.DB_PASSWORD,
//  connectionString: process.env.DB_CONNECTION_STRING,
//    });
// console.log(process.env.DB_CONNECTION_STRING);
// console.log(client);
// console.log(process.env.DB_PASSWORD);


//  app.listen(8080, ()=>{
//  console.log(`server is running at http://localhost:${port}`)
//  })
// client.connect();

// app.get('/users', (req, res) => {
//     console.log("fdgfhgh");
//    // res.setHeader("content-type" , "application/json")
//      client.query(`SELECT * FROM sl_sec_spec_item_hdr` , (err, result)=>{
//        if(!err){
//          console.log(result.rows);
//            res.send(result.rows)   
//            }
//        else{
//             console.log(err.message);

//          }

         
//     })
    
// });

//   app.get('/users/:id', (req, res)=>{
//     client.query(`Select * from cut where id = ${req.params.id}` , (err, result)=>{
//       if(!err){
//           //console.log(result.rows);
//            res.send(result.rows);
//     }
//       else{
//            console.log(err.message);
//         }

//      //  client.end();i
//    })
   
//  });

// app.post('/todos', async (req, res) =>{
//     try{
//                console.log(req.body);

//     } catch (err){
//         console.error(err.message);
//     }
//    // client.end();
// });

// app.all('*', (req, res, next) =>{
//     res.send(404).json({
//         status:'false',
//         message:'Page not Found'
//     })
// })