require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const config = require('./utils/config')
const usersRouter = require('./routes/users') // Import users router
const blogRouter = require('./routes/blogs') // Import blog router
const loginRouter = require('./controllers/login');

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
app.use('/api/login', loginRouter);



// Use users router for handling requests to /api/users
app.use('/api/users', usersRouter)

// Use blog router for handling requests to /api/blogs
app.use('/api/blogs', blogRouter)


const PORT = 3004
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
