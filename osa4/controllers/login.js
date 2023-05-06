const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

loginRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });

  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: 3600 });


  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;


