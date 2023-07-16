const express = require('express');
const router = express.Router();

const cloudinaryController = require('../controllers/cloudinary-controller');
const { loginRequired, adminRequired } = require('../middleware/auth-middleware');

router.get('/signature', loginRequired, adminRequired, cloudinaryController.getSignature);

module.exports = router;
