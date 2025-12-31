const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', projectController.getAllProjects);

// Protected
router.post('/', authMiddleware, upload.single('image'), projectController.createProject);
router.put('/:id', authMiddleware, upload.single('image'), projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
