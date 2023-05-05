const supertest = require('supertest')
const app = require('../index') // Import your app
const api = supertest(app)
const Blog = require('../models/blog')

let server

beforeAll((done) => {
  server = app.listen(0, done) // Start the server on a random available port
})

afterAll((done) => {
  server.close(done) // Close the server after tests
})

describe('GET /api/blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    const blogsInDb = await Blog.countDocuments()
  
    expect(response.body).toHaveLength(blogsInDb)
  })

  test('blogs have an "id" field instead of "_id"', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
  
    expect(firstBlog.id).toBeDefined()
    expect(firstBlog._id).not.toBeDefined()
  })
  test('a blog can be added and the number of blogs increases', async () => {
    // Get the initial list of blogs
    const initialBlogs = await api.get('/api/blogs')

    // Define a new blog to be added
    const newBlog = {
      title: 'New Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com',
      likes: 5,
    }

    // Add the new blog using a POST request
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get the updated list of blogs
    const updatedBlogs = await api.get('/api/blogs')

    // Check that the number of blogs has increased by 1
    expect(updatedBlogs.body).toHaveLength(initialBlogs.body.length + 1)

    // Check that the new blog is in the updated list of blogs
    const titles = updatedBlogs.body.map(blog => blog.title)
    expect(titles).toContain('New Test Blog')
  })
  test('if likes is not provided, set it to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com'
    }
  
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
  
    expect(response.body.likes).toBe(0)
  })
  test('POST /api/blogs fails without title and/or url', async () => {
    const newBlogWithoutTitle = {
      author: 'Ada Lovelace',
      url: 'https://example.com/blogpost-without-title'
    }
    const newBlogWithoutUrl = {
      title: 'Blog post without URL',
      author: 'Grace Hopper'
    }
    const newBlogWithoutTitleAndUrl = {
      author: 'Alan Turing'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitleAndUrl)
      .expect(400)
  })
  
})