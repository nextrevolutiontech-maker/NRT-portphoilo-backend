const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../config/cloudinary');
const fs = require('fs');

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const result = await uploadImage(req.file.path);

        // Delete local file after upload
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Upload successful',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

module.exports = router;
