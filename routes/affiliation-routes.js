const express = require('express');
const { check } = require('express-validator');

const affiliationController = require('../controllers/affiliations-controllers');

const router = express.Router();

router.get('/', affiliationController.getAllAff);

router.post(
  '/',
  [
    check('affEmail').normalizeEmail().isEmail(),
    check('affChannelURL').matches(/https:\/\/www\.youtube\.com\/@[A-Za-z]+/),
  ],
  affiliationController.postAff,
);

router.delete('/:affid', affiliationController.deleteAffiliationById);

module.exports = router;
