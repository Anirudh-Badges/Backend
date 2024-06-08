const mangoose = require("mongoose");
require("dotenv").config();

const dbConnect =()=>{
    mangoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser : true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log("Database Connected Successfully");
    }).catch((error)=>{
        console.log("Database Connection Failed");
        console.log(error);
        process.exit(1);
    })
}
module.exports = dbConnect;