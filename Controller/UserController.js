const User = require('../Modals/UserModal');
const cloudinaryUploadImg = require('../utils/Cloudinary');

const fs = require('fs');  

exports.DataUpload = async (req, res) => {
    try {
    
        const io = req.app.get('io');  
        console.log('io object:', io);  
        
        const Username = req.body.Username;
        const SocialHandle = req.body.SocialHandle;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const imageUrls = [];

        for (const file of req.files) {
            const { path } = file;
            const newImage = await uploader(path);  
            imageUrls.push(newImage.url);  

            fs.unlinkSync(path);
        }

        let updateuser = await User.findOne({ SocialHandle: SocialHandle });

        if (updateuser) {
            updateuser.images = updateuser.images.concat(imageUrls);
            await updateuser.save();  
            console.log('Emitting newUser event with new user:', updateuser); 
            io.emit('newUser', updateuser);  
        } else {
            updateuser = new User({
                Username,
                SocialHandle,
                images: imageUrls
            });
            await updateuser.save();  
            console.log('Emitting newUser event with new user:', updateuser); 
            io.emit('newUser', updateuser); 
        }

        res.status(200).json({
            status: 'success',
            data: {
                updateuser
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            stack: error.stack
        });
    }
};

exports.getall = async(req,res) => {
    try {
        const data = await User.find();
        res.status(200).json({
            status:'success',
            data
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            stack: error.stack
        });
    }
};
