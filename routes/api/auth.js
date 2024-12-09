const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { v4 : uuidv4 } = require('uuid');
const { SECRET, EMAIL } = process.env;
const User = require('../../schemas/userSchema');
const validation = require('../../models/validation');
const autenticate = require('../../middleware/authMiddleware');
const uploadAvatar = require('../../middleware/upload');
const updateAvatar = require('../../middleware/update');
require('dotenv').config();


router.post('/signup', async (req, res, next) => {
    try {
      console.log(req.body);
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

      const avatarURL = gravatar.url(email, {
        s: '200',
        d: 'retro'
      },true);

      const verificationToken = uuidv4();

      const newUser = new User({
        email,
        password: hashedPassword, 
        subscription: 'starter', 
        avatarURL,
        verificationToken
      });

      const msg = {
        from: EMAIL, 
        to: email,
        subject: "Verify your email address",
        html: `Click <a href="http://localhost:3000/users/verify/${verificationToken}">here</a> to verify your email address.`
      };

      await sgMail.send(msg)
  
      await newUser.save();

      res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL
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

    res.status(200).json({message:{
      user:{
        email,
        subscription
      }
    }})

  }catch(error){
    next(error);
  }
});



router.post('/refresh-token', async (req, res, next) => {
  const { refreshToken } = req.body;

  if(!refreshToken){
    res.status(401).json({message:'Refresh token is required'});
  }

  try{
    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH);
    const user = await User.findById(decoded.id);

    if(!user || user.token !== refreshToken){
      res.status(403).json({message:'Invalid refresh token'})
    }

    const accessToken = jwt.sign(
      { 
        id: user._id
      },
      SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      accessToken
    })
  }catch(error){
    next(error);
  }
});



router.patch('/avatars', autenticate, uploadAvatar, updateAvatar);



router.get('/verivity/:verivicationToken', async (req, res, next) => {
  try{
    const { verificationToken } = req.params;
    const user = await User.findOne(verificationToken);
    if(!user){
      return res.status(400).json({message:'User not found'});
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({message:'Verification successful'});
  }catch(error){
    next(error);
  }
});



router.post('/verify', async (req, res, next) => {
  const {email} = req.body;

  if(!email){
    return res.status(400).json({message:'missing required field email'});
  }

  try{
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({message:'User not found'});
    }

    if(user.verify){
      return res.status(400).json({message:'Verification has already been passed'});
    }

    const verificationToken = uuidv4();
    user.verificationToken = verificationToken;

    await user.save();

    const msg = {
      from: EMAIL, 
      to: email,
      subject: "Verify your email address",
      html: `Click <a href="http://localhost:3000/users/verify/${verificationToken}">here</a> to verify your email address.`
    };

    await sgMail.send(msg);

    res.status(200).json({message: 'Verification email sent'})

  }catch(error){
    next(error);
  }
});

module.exports = router;
  