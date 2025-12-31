const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImageFromBuffer } = require('../config/cloudinary');

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const result = await uploadImageFromBuffer(req.file.buffer);

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
