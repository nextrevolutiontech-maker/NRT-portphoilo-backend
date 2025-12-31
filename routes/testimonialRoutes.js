const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Get all testimonials (Public)
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a testimonial (Protected)
router.post('/', authenticateToken, async (req, res) => {
    const { author, role, company, quote, rating, image_url } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO testimonials (author, role, company, quote, rating, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [author, role, company, quote, rating, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a testimonial (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { author, role, company, quote, rating, image_url } = req.body;
    try {
        const result = await db.query(
            'UPDATE testimonials SET author = $1, role = $2, company = $3, quote = $4, rating = $5, image_url = $6 WHERE id = $7 RETURNING *',
            [author, role, company, quote, rating, image_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a testimonial (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
