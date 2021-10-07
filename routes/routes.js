const { render } = require("ejs");
const express = require("express");
const router = express.Router();
// require here your model 
const User = require('../models/users');
// require here 'multer' package for image uploading
const multer = require('multer');
// require for fs package for unlinking files 
const fs = require("fs");
// import here contact model 
const Contact = require("../models/contacts");


// image upload 
var storege = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "./uploads");
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() +"_"+ file.originalname);
    },
});

// create a middleware for take the image file will image
var upload = multer({
    storage:storege,
}).single('image');         // Here image is field name of your input 

// Add User Route
router.get('/add', function(req, res){
    res.render('registration');
});

// User inserting with below rotes
router.post('/add', upload, function(req, res){
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender,
        image:req.file.filename,
    });
    user.save((err)=>{
        if(err){
            res.json("Data not inserted");
        }else{
            res.redirect("/user-list");
        }
    })
});

// create the routers 
router.get('/users', function(req, res){
    res.send("All User Details here ");
});

// Home Page
router.get('/', function(req, res){
    res.render('index');
});

// user-list routes
router.get('/user-list', function(req, res){
    User.find().exec((err, users)=>{
        if(err){
            res.json({"user-details":"Sorry Data is note available !"});
        }else{
            res.render('user-list',{
                title : "User Details",
                users : users,
            });     
        }
    });
});

// Edit Page for hold the page and spreed the user information on edit page
router.get('/edit/:id', function(req, res){
    // take id from url with request
    let id = req.params.id;
    // initialized here model name 
    User.findById(id, (err, user)=>{
        if(err){
            res.redirect("/");
        }else{
            if(user == null){
                res.redirect("/");
            }else{
                res.render("edit_user",{
                    title : "Edit Page",
                    user : user,
                });
            }
        }
    });
    
});

// Update data with edit page with below URL
router.post("/update/:id", upload, function(req, res){
    // take id, and new_imag (if anyone uplode) with url
    let id = req.params.id;
    let new_imag = "";

    if(req.file){
        new_imag = req.file.filename;
        try{
            fs.unlinkSync("./uploads/"+req.body.old_image);
        }catch(err){
            console.log("Error in catch");
        }
    }else{
        new_imag = req.body.old_image;
    }

    // take also another detail 
    User.findByIdAndUpdate(id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        gender : req.body.gender,
        image : req.body.new_imag,
    }, (err, result)=>{
        if(err){
            res.json({
                "message" : "Data not updated !",
            });
        }else{
            res.json({
                "message" : "Data Updated Successfully !",
            });
        }
    });
    // check here also through a error when I redirect to another page
    // res.redirect("user-list");
});

// delete user details according to his id
router.get("/delete/:id", function(req, res){
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result)=>{
        if(result.image != ""){
            try {
                fs.unlinkSync("./uploads/" + result.image);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // Check here commented code it's throw an error (Error is = err is not defined)

    // if(err){
    //     res.json({"message":"Data deleted successfully !"});
    // }else{
    //     res.json({ "message" : "Data are deleted successfully !" });
    // }

    res.redirect("/user-list");
});

//                                  Contact Us Routes

router.get("/contact", function(request, response){
    response.render("contact");
});
router.post("/contact", function(request, response){
    const contact = new Contact({
        name : request.body.name,
        email : request.body.email,
        phone : request.body.phone,
        message : request.body.message,
    });
    contact.save(function(error){
        if(error){
            response.json({"message" : "Data are not saved !"});
        }else{
            response.redirect("/")
        }
    });
});

// Route for login 
router.get('/login', function(request, response){
    response.render('login');
});

module.exports = router;