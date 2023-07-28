const HttpError = require('../models/http-error');
const Report = require('../models/report');

const getAllReports = async (req, res, next) => {
  let reports;
  try {
    reports = await Report.find();
  } catch (err) {
    const error = new HttpError('Fetching reports failed, please try again later.', 500);
    return next(error);
  }
  res.json({ reports: reports.map((report) => report.toObject({ getters: true })) });
};

const getReportById = async (req, res, next) => {
  const query = Report.where({ _id: req.params.id });
  let report;
  try {
    report = await query.findOne();
  } catch (err) {
    const error = new HttpError('Fetching report failed, please try again.', 500);
    return next(error);
  }
  res.json(report);
};

const postReport = async (req, res, next) => {
  const report = new Report(req.body);
  try {
    await report.save();
    res.json(report);
  } catch (err) {
    const error = new HttpError('Post report failed, please try again.', 500);
    return next(error);
  }
};

const updateReportById = async (req, res, next) => {
  const report = req.body;
  const filter = { _id: req.params.cid };
  const update = { reportContent: report.reportContent };
  try {
    let doc = await Report.findOneAndUpdate(filter, update);
    res.json(doc);
  } catch (err) {
    const error = new HttpError('Update report failed, please try again.', 500);
    return next(error);
  }
};

const deletReportById = async (req, res, next) => {
  const filter = { _id: req.params.id };
  try {
    let doc = await Report.findOneAndDelete(filter);
    res.json(doc);
  } catch (err) {
    const error = new HttpError('Delete report failed, please try again.', 500);
    return next(error);
  }
};

exports.getAllReports = getAllReports;
exports.getReportById = getReportById;
exports.postReport = postReport;
exports.updateReportById = updateReportById;
exports.deletReportById = deletReportById;
