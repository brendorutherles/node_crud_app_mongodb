// create here Schema for contact us 
const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    name:{
        type : String,
        require : true, 
    },
    email:{
        type : String,
        require : true,
    },
    phone:{
        type : Number,
        require : true,
    },
    message:{
        type : String,
        require : true,
    },
});

// export it 
module.exports = mongoose.model("Contact", contactSchema);