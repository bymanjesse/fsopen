require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')



const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

// Blogien tulostus
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

// Blogien postaus
app.post('/api/blogs', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0
  })

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    // Handle any errors that may occur during the save operation
    response.status(500).json({ error: 'An error occurred while saving the blog' })
  }
})

// Blogien päivitys
app.put('/api/blogs/:id', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const updatedBlog = {
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0
  }

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(result)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'An error occurred while updating the blog' })
  }
})

// Blogien poisto
app.delete('/api/blogs/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'An error occurred while deleting the blog' })
  }
})

const PORT = 3004
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
