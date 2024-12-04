const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../schemas/userSchema');
const validation = require('../../models/validation');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const autenticate = require('../../middleware/authMiddleware');
const { SECRET } = process.env;

router.post('/signup', async (req, res, next) => {
    try {
      const { error } = validation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: hashedPassword, 
        subscription: 'starter', 
      });
  
      await newUser.save();

      res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  });

  

router.post('/login', async (req, res, next) => {
  try {
    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign(
      {
        id: user._id, 
      },
      SECRET, 
      { expiresIn: '15m' } 
    );


    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
});


router.get('/logout', autenticate, async(req, res, next) => {
  try{
    const user = await User.findById(req.user._id);

    if(!user){
      return res.status(401).json({message:"Not authorized"});
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  }catch(error){
    next(error);
  }
});

router.get('/current', autenticate, async(req, res, next) => {
  try{
    const {email, subscription} = req.user;
    console.log(email);

    res.status(200).json({message:{
      user:{
        email,
        subscription
      }
    }})

  }catch(error){
    console.log(error)
    next(error);
  }
});



module.exports = router;