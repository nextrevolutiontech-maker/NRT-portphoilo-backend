const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Get all services (Public)
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM services ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a service (Protected)
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, icon, image_url, features } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO services (title, description, icon, image_url, features) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, icon, image_url, features]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a service (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, icon, image_url, features } = req.body;
    try {
        const result = await db.query(
            'UPDATE services SET title = $1, description = $2, icon = $3, image_url = $4, features = $5 WHERE id = $6 RETURNING *',
            [title, description, icon, image_url, features, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a service (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
