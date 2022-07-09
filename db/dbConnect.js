const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
    try {
        let db = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Successfully connected to MongoDB Atlas!");
    } catch (err) {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(err);
    }
}

module.exports = dbConnect;