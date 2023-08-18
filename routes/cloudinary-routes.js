const express = require('express');
const router = express.Router();

const cloudinaryController = require('../controllers/cloudinary-controller');
const { loginRequired } = require('../middleware/auth-middleware');

router.get('/signature', loginRequired, cloudinaryController.getSignature);

module.exports = router;
