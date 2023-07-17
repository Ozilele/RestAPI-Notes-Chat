const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_CONFIG = process.env.MONGO_URI

let conn;

const connectToDb = async function() { // function used to connect to DB
  try {
    const connection = await mongoose.connect(MONGO_CONFIG);
    conn = connection.connection;
    console.log(`MongoDB connected`);
  }
  catch(error) {  
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectToDb, conn };
