const express = require('express');

const affiliationController = require('../controllers/affiliations-controllers');

const router = express.Router();

router.get('/', affiliationController.getAllAff);

router.post('/', affiliationController.postAff);

router.delete('/:affid', affiliationController.deleteAffiliationById);

module.exports = router;
