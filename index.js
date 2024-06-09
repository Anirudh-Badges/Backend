const express = require("express");
const dbConnect = require("./config/database");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 8000;

app.listen(port,(req,res)=>{
    // res.send(`Server Started At ${PORT}`);
    console.log("Welcome to the Server",port);
});


dbConnect();

app.use(express.json());

const route = require("./routes/route");
app.use("/api/v1",route);

app.get("/demo",(req,res) => {
   return res.json({
    sucess: true,
    message : "this is homepage",
   })
})

