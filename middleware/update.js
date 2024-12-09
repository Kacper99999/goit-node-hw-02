const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const { v4 : uuidv4 } = require('uuid');
const User = require('../schemas/userSchema');

const avatarsDir = path.join(process.cwd(), 'public/avatars');

const MAX_AVATAR_HEIGHT = 250;
const MAX_AVATAR_WIDTH = 250;

const updateAvatar = async(req, res, next) => {
    try{
        if (!req.file){
            return res.status(400).json({message:'No file uploaded'});
        }

        const { path: tmpPath, originalname } = req.file;
        const ext = path.extname(originalname).toLowerCase();
        const uniqueName = `${uuidv4()}${ext}`;
        const avatarPath = path.join(avatarsDir, uniqueName);



        await fs.promises.rename(tmpPath, avatarPath);

        const image = await Jimp.read(avatarPath);
        const w = image.bitmap.width;
        const h = image.bitmap.height;

        const cropWidth = w > MAX_AVATAR_WIDTH ? MAX_AVATAR_WIDTH : w;
        const cropHeight = h > MAX_AVATAR_HEIGHT ? MAX_AVATAR_HEIGHT : h;

        const centerX = Math.round(w / 2 - cropWidth / 2);
        const centerY = Math.round(h / 2 - cropHeight / 2 );

        await image 
        .crop(centerX, centerY, cropWidth, cropHeight)
        .resize(250, 250)
        .writeAsync(avatarPath);

        const avatarURL = `/avatars/${uniqueName}`;

        await User.findByIdAndUpdate(req.user._id, {avatarURL});

        res.json({avatarURL});
    }catch(error){
        next(error);
    }
}

module.exports = updateAvatar;