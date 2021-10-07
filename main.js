// import here packages

// configure .env file inside main.js file 
require("dotenv").config();
// import here express.js framework
const express = require('express');
// import here mongoos package
const mongoose = require('mongoose');
// import here express-session for maintaining the session 
const session = require('express-session');

//Database Connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error", (error)=>console.log(error));
db.once("open", ()=>console.log("Congratulations database has been connected !"));

const app = express();
const PORT = process.env.PORT || 5000;

//Create Middleware 

// Create middleware for including static files like css 
app.use('/assets', express.static('assets'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
        secret:"my secret key",
        saveUninitialized:true,
        resave:false,
    })
);


// another middleware
// app.use((req,res,next)=>{
//     res.locals.message = req.locals.message;
//     delete req.session.message;
//     next();
// });

// create middleware for set the upload file as static , for showing image
app.use(express.static('uploads'));

// prfix of routes
app.use("", require("./routes/routes"));

// Define here your template engine
app.set('view engine','ejs');

app.listen(PORT, ()=>{
    console.log('Server Started ');
});