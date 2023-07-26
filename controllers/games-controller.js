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
  res.status(201).json({ message: 'Create game succeed' });
};

const getGames = async (req, res) => {
  let {
    name,
    genres,
    platforms,
    modes,
    tags,
    releaseDate,
    score,
    page = 0,
    limit = 5,
    sort,
  } = req.query;
  page = parseInt(page >= 0 ? page : 0);
  const tryParseLimit = parseInt(limit);
  limit = tryParseLimit === NaN ? 5 : tryParseLimit;

  // // Make sure if single value is passed, filter's $all still work
  const toArray = (o) => (Array.isArray(o) ? o : [o]);

  // Build a filter
  let filter = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' }; // case insensitive
  }
  if (genres) {
    filter.genres = { $all: toArray(genres) };
  }
  if (platforms) {
    filter.platforms = { $all: toArray(platforms) };
  }
  if (modes) {
    filter.modes = { $all: toArray(modes) };
  }
  if (tags) {
    filter.tags = { $all: toArray(tags) };
  }
  if (releaseDate) {
    filter.releaseDate = {};
    releaseDate = toArray(releaseDate);
    const from = parseInt(releaseDate[0]);
    const to = parseInt(releaseDate[1]);
    if (from) {
      filter.releaseDate.$gte = new Date(from, 0, 1); // start of year
    }
    if (to) {
      filter.releaseDate.$lte = new Date(to, 11, 31); // end of year
    }
  }
  if (score) {
    filter.score = {};
    score = toArray(score);
    const from = parseInt(score[0]);
    const to = parseInt(score[1]);
    if (from) {
      filter.score.$gte = from;
    }
    if (to) {
      filter.score.$lte = to;
    }
  }

  let matchGamesLimited;
  let matchCount;
  try {
    // I don't have a better solution other than running 2 queries :(
    await Game.aggregate()
      .lookup({
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'tempReviews',
      })
      .addFields({ score: { $avg: '$tempReviews.rating' } })
      .project({
        tempReviews: 0,
        reviews: 0,
        __v: 0,
      })
      .match(filter)
      .then((res) => {
        matchCount = res.length;
      });

    const sortParam = {};
    sortParam[sort] = -1;

    matchGamesLimited = await Game.aggregate()
      .lookup({
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'tempReviews',
      })
      .addFields({ score: { $avg: '$tempReviews.rating' } })
      .project({
        tempReviews: 0,
        reviews: 0,
        __v: 0,
      })
      .match(filter)
      .sort(sortParam)
      .skip(page * limit)
      .limit(limit)
      .exec();
  } catch (err) {
    console.log(err);
    // Just send nothing if params is not correctly input
    return res.send([]);
  }
  // Set pagination metadata in header for front-end to do pagination
  res.set({ 'Pagination-Count': matchCount, 'Pagination-Page': page, 'Pagination-Limit': limit });
  res.set({
    'Access-Control-Expose-Headers': ['Pagination-Count', 'Pagination-Page', 'Pagination-Limit'],
  });

  return res.send(matchGamesLimited);
};

const getGame = async (req, res) => {
  const gameId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    return res.send({});
  }
  let matchedGames;
  try {
    matchedGames = await Game.aggregate()
      .lookup({
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'reviews',
      })
      .addFields({ score: { $avg: '$tempReviews.rating' } })
      .project({
        __v: 0,
        reviews: { __v: 0 },
      })
      .match({ _id: new mongoose.Types.ObjectId(gameId) })
      .exec();
  } catch (err) {
    console.log(err);
    // Just send nothing if params is not correctly input
    return res.send({});
  }
  return res.send(matchedGames.length === 1 ? matchedGames[0] : {});
};

exports.postGame = postGame;
exports.getGames = getGames;
exports.getGame = getGame;
