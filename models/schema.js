const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "set name for contact"]
    },
    emial:{
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

const Contact = mongoose.model('Contatc',schema);

module.exports = Contact;