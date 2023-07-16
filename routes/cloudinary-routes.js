const express = require('express');
const router = express.Router();

const cloudinaryController = require('../controllers/cloudinary-controller');

router.get('/signature', cloudinaryController.getSignature);

module.exports = router;
