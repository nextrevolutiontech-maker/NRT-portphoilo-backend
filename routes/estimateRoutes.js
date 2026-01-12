
const express = require('express');
const router = express.Router();
const estimateController = require('../controllers/estimateController');

router.post('/', estimateController.sendEstimateEmail);

module.exports = router;
