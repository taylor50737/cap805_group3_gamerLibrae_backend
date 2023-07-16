const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Game = require('../models/game');

const postGame = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Request body not complete, please check your data.', 400));
  }

  const createdGame = new Game({
    name: req.body.name,
    developer: req.body.developer,
    publisher: req.body.publisher,
    releaseDate: new Date(req.body.releaseDate), // Javascript date object when put and get
    genres: req.body.genres,
    platforms: req.body.platforms,
    modes: req.body.modes,
    tags: req.body.tags,
    banner: req.body.bannerResBody.public_id,
    portrait: req.body.portraitResBody.public_id,
  });

  try {
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    await createdGame.save({ session: dbSession });
    await dbSession.commitTransaction();
  } catch (err) {
    const error = new HttpError('Create game failed', 500);
    return next(error);
  }
  res.status(201).json({ message: 'Create game successed' });
};

exports.postGame = postGame;
