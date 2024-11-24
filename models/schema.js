const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "set name for contact"]
    },
    email:{
        type:String,
        unique:true,
        required:[true, "set emial for contact"]
    },
    phone:{
        type:String,
        unique:true,
        required:[true, "set phone for contact"]
    },
    favorite:{
        type:Boolean,
        default:false
    }
    
});

const Contact = mongoose.model('db-contacts',schema);

module.exports = Contact;