const express = require('express');
const router = express.Router();
const { getWards } = require('../controllers/wardController');

router.get('/', getWards);

module.exports = router;
