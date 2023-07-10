const express = require('express');

const router = express.Router();

const DUMMY_USERS = [
  {
    id: 'u1',
    userName: 'bdearden0',
    email: 'aflynn0@bluehost.com',
    password: '$2a$04$a4179HhWb9fEdIPEvEAW.uVBcdPCHHoRq7X0.HD0kd/Mwbl3losaS',
    isAdmin: true,
    avatar: 'https://robohash.org/etimpeditcorporis.png?size=50x50&set=set1',
    status: 'active',
    favouriteGame: 'Overwatch',
    wishList: 'Overwatch',
    channelURL: 'https://www.youtube.com/channel/cIhS_K-SE--',
    joinedAffiliation: true,
    Affiliation: {
      affId: 808,
      affChannelURL: 'https://www.youtube.com/channel/cIhS_K-SE--',
      affEmail: 'aflynn0@bluehost.com',
    },
  },
];

router.get('/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find((u) => {
    return u.id === userId;
  });
  res.json({ user });
});

module.exports = router;
