const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/api/contact', userController.createUser);

module.exports = router;
