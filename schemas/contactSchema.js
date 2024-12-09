const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
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
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
    
});

const Contact = mongoose.model('db-contacts',schema);

module.exports = Contact;