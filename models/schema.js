const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "set name for contact"]
    },
    email:{
        tyle:String
    },
    phone:{
        type:String
    },
    favorite:{
        type:Boolean,
        default:false
    }
    
});

const Contact = mongoose.model('db-contacts',schema);

module.exports = Contact;