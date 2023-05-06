const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const getTokenFrom = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return null;
};


// Get all blogs
router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
})

// Create a new blog
router.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.url) {
    return res.status(400).send({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
})


// Update a blog
router.put('/:id', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const updatedBlog = {
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0
  }

  try {
    const result = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true })
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while updating the blog' })
  }
})

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while deleting the blog' })
  }
})

module.exports = router
