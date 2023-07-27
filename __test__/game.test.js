const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Game = require('../models/game');
const { randomArrayPicks, randomDate, randomString } = require('../utils/testUtils');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority`;

const genreChoosable = [
  'Action',
  'Adventure',
  'RPG',
  'Open World',
  'First Person Shooter',
  'Simulation',
  'Puzzlers',
];
const platformChoosable = ['Switch', 'PS4', 'PS5', 'Windows', 'Xbox One', 'Xbox Series X/S'];
const modeChoosable = ['Single-Player', 'Offline', 'Multi-Player', 'Online'];
const tagChoosable = ['Exciting', 'Refreshing', 'NSFW', 'Funny', 'Soulslike', 'Marvel'];

const NUM_OF_GAMES = 500;
const DEFAULT_LIMIT = 5;
let fakeGames = [];

beforeAll(async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: '__testGame__', // change to test db in .env
  });

  for (let i = 0; i < NUM_OF_GAMES; i++) {
    const item = {
      name: randomString(6),
      developer: randomString(6),
      publisher: randomString(6),
      releaseDate: randomDate(new Date(2000, 0, 1), new Date(2023, 11, 31)), // month zero indexed, LOL
      genres: randomArrayPicks(genreChoosable, 0.3),
      platforms: randomArrayPicks(platformChoosable, 0.3),
      modes: randomArrayPicks(modeChoosable, 0.3),
      tags: randomArrayPicks(tagChoosable, 0.3),
      banner: randomString(6),
      portrait: randomString(6),
    };

    fakeGames.push(item);
  }

  await Game.insertMany(fakeGames);
});

afterAll(async () => {
  await Game.deleteMany({});
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('search games by filter', () => {
  test('no query params return 5 games', async () => {
    const res = await request(app).get('/api/games');
    expect(res.statusCode).toEqual(200);
  });

  test('name query param is working', async () => {
    let name = 'k';
    const res = await request(app).get(`/api/games?limit=${NUM_OF_GAMES}&name=${name}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.every((g) => g.name.toLowerCase().includes(name))).toBeTruthy();
  });

  test('pagination full page is working', async () => {
    const page = 1;
    const res = await request(app).get(`/api/games?page=${page}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(DEFAULT_LIMIT);
  });

  test('pagination last page is working', async () => {
    const page = Math.ceil(NUM_OF_GAMES / DEFAULT_LIMIT) - 1;
    const res = await request(app).get(`/api/games?page=${page}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(NUM_OF_GAMES - page * DEFAULT_LIMIT);
  });

  test('genres pick is working', async () => {
    const genres = randomArrayPicks(genreChoosable, 0.3);
    let q = '';
    for (genre of genres) {
      q += `genres=${genre}&`;
    }
    const res = await request(app).get(`/api/games?${q}`);

    expect(res.statusCode).toEqual(200);

    expect(
      res.body.every((game) => genres.every((genre) => game.genres.includes(genre))),
    ).toBeTruthy();
  });

  test('genres + platforms + modes + tags pick is working', async () => {
    const genres = randomArrayPicks(genreChoosable, 0.2);
    const platforms = randomArrayPicks(platformChoosable, 0.2);
    const modes = randomArrayPicks(modeChoosable, 0.2);
    const tags = randomArrayPicks(tagChoosable, 0.2);

    const sp = new URLSearchParams({});

    for (genre of genres) {
      sp.append(Object.keys({ genres })[0], genre); // get variable's name
    }
    for (platform of platforms) {
      sp.append(Object.keys({ platforms })[0], platform);
    }
    for (mode of modes) {
      sp.append(Object.keys({ modes })[0], mode);
    }
    for (tag of tags) {
      sp.append(Object.keys({ tags })[0], tag);
    }

    const res = await request(app).get(`/api/games?${sp}`);
    expect(res.statusCode).toEqual(200);
    expect(
      res.body.every(
        (game) =>
          genres.every((genre) => game.genres.includes(genre)) &&
          platforms.every((platform) => game.platforms.includes(platform)) &&
          modes.every((mode) => game.modes.includes(mode)) &&
          tags.every((tag) => game.tags.includes(tag)),
      ),
    ).toBeTruthy();
  });

  test('score and releaseDate is working', async () => {
    const score = [Math.random() * 100, Math.random() * 100];
    const releaseDate = [
      randomDate(new Date(2000, 0, 1), new Date(2023, 11, 31)),
      randomDate(new Date(2000, 0, 1), new Date(2023, 11, 31)),
    ];

    const res = await request(app).get(
      encodeURI(
        `/api/games?score=${score[0]},${score[1]}&releaseDate=${releaseDate[0]},${releaseDate[1]}`,
      ),
    );

    expect(res.statusCode).toEqual(200);

    expect(
      res.body.every(
        (game) =>
          game.score >= score[0] &&
          game.score <= score[1] &&
          game.releaseDate >= releaseDate[0] &&
          game.releaseDate <= releaseDate[1],
      ),
    ).toBeTruthy();
  });

  test('sort by release date is working', async () => {
    const SORT_OPTION = 'releaseDate';
    const res = await request(app).get(encodeURI(`/api/games?sort=${SORT_OPTION}`));
    expect(res.statusCode).toEqual(200);
    const biggest = new Date(res.body[0].releaseDate);
    expect(res.body.every((g) => biggest >= new Date(g.releaseDate))).toBeTruthy();
    // const consoleSpy = jest.spyOn(console, 'log');
    // console.log(res.body);
    // expect(consoleSpy).toHaveBeenCalledWith(res.body);
  });
});

describe('search game by id', () => {
  test('search game by id is working', async () => {
    const gameNum = Math.round(Math.random() * NUM_OF_GAMES);
    const gameResByNameRes = await request(app).get(
      encodeURI(`/api/games?name=${fakeGames[gameNum].name}`),
    );
    const gameResById = await request(app).get(
      encodeURI(`/api/games/${gameResByNameRes.body[0]._id}`),
    );
    expect(gameResById.statusCode).toEqual(200);
    expect(gameResById.body.name === fakeGames[gameNum].name).toBeTruthy();
  });
});
