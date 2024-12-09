require('dotenv').config();
const mongoose = require('mongoose')
const URI = process.env.DB_URI;

const dbConnect = async () =>{
    try{
        await mongoose.connect(URI)
     .then(async()=>{
       console.log("Database connection successful")
     })
     }
     catch(error){
         console.log("Database connection error:",error)
       process.exit(1);
     }     
}

module.exports = dbConnect;

