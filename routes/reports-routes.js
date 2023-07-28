const express = require('express');
const { loginRequired } = require('../middleware/auth-middleware');

const reportsController = require('../controllers/reports-controller');

const router = express.Router();

router.get('/', reportsController.getAllReports);

router.get('/:cid', reportsController.getReportById);

router.post('/', reportsController.postReport);

router.put('/:cid', loginRequired, reportsController.updateReportById);

router.delete('/:cid', loginRequired, reportsController.deletReportById);

module.exports = router;
