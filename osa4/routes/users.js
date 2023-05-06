const bcrypt = require('bcrypt');
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const newUser = new User({ username, password, name })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    response.json(users);
})

module.exports = usersRouter