const cloudinary = require('cloudinary')
cloudinary.config({ 
    cloud_name: 'dybkw5blm', 
    api_key: '374328664352711', 
    api_secret: '_KDzPg8FKInEzbjKAhZd7OdNWho' 
  });

  const cloudinaryUploadImg = async(fileToUploads) =>{
    return new Promise((resolve) =>{
        cloudinary.uploader.upload(fileToUploads, (result) =>{
            resolve({
                url:result.secure_url,
            },
            {
                resource_type:"auto",
            })
        })
    })
}
module.exports = cloudinaryUploadImg