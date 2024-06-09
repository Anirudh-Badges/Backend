const mangoose = require("mongoose");

require("dotenv").config();  
const dbConnect = () => {
    mangoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => { console.log("DB connection successful") })
        .catch((error) => { console.log("received an error");
            console.error(error.message);
            //  
            process.exit(1);
         });
}

module.exports = dbConnect;