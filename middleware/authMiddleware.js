const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');
require('dotenv').config();
const {SECRET} = process.env;

const autenticate = async (req,res,next) => {
    const authHeader = req.headers.autorization;

    const token = authHeader?.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Not authorized"});
    }

    try{
        const decoded = jwt.verify(token, SECRET);

        const user = await User.findById(decoded.id);

        if(!user || user.token !== token){
            return res.status(401).json({message:"Not authorized"});
        }

        res.user = user;

        next();
    }
    catch(error){
        return res.status(401).json({message:"Not authorized"});
    }
}

module.exports = autenticate;