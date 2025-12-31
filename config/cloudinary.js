const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nrt-portfolio',
            resource_type: 'auto' // Important for videos
        });
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = { cloudinary, uploadImage };
