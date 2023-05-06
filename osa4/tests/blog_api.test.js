const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

let server

beforeAll((done) => {
  server = app.listen(0, done) // Start the server
})

afterAll((done) => {
  server.close(done) // Close
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
})

describe('POST /api/blogs', () => {
  test('a blog can be added and the number of blogs increases', async () => {
    // Get the initial list of blogs
    const initialBlogs = await api.get('/api/blogs')

    // Define a new blog to be added
    const newBlog = {
      title: 'POST Test Blog',
      author: 'POST Author',
      url: 'https://testiblogi.com',
      likes: 5,
    }

    // Add the new blog
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get the ID of the new blog
    const newBlogId = response.body.id

    // Get the updated list of blogs
    const updatedBlogs = await api.get('/api/blogs')

    // Check that the number of blogs has increased by 1
    expect(updatedBlogs.body).toHaveLength(initialBlogs.body.length + 1)

    // Check that the new blog is in the updated list of blogs
    const titles = updatedBlogs.body.map(blog => blog.title)
    expect(titles).toContain('New Test Blog')

    // Delete the test blog
    await api.delete(`/api/blogs/${newBlogId}`).expect(204)
  })

  test('if likes is not provided, set it to 0', async () => {
    const newBlog = {
      title: 'Likes to 0',
      author: 'Test Author',
      url: 'https://testi.com'
    }

    // Post the new blog and get its ID
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    const newBlogId = response.body.id

    // Check that the likes property is set to 0
    expect(response.body.likes).toBe(0)

    // Delete the test blog
    await api.delete(`/api/blogs/${newBlogId}`).expect(204)
  })

  test('POST /api/blogs fails without title and/or url', async () => {
    const newBlogWithoutTitle = {
      author: 'Jesse Byman',
      url: 'https://testi.com/without-title'
    }
    const newBlogWithoutUrl = {
      title: 'Blog post without URL',
      author: 'Grace Hopper'
    }
    const newBlogWithoutTitleAndUrl = {
      author: 'Jere Byman'
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
  
describe('PUT /api/blogs/:id', () => {
  test('a blog can be updated', async () => {
  // Define a new blog to be added
  const newBlog = {
  title: 'Test Blog for Update',
  author: 'Test Author',
  url: 'https://testblog.com',
  likes: 5,
  }
  // Add the new blog using a POST request
  const postResponse = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  // Get the ID of the new blog
  const blogToUpdate = postResponse.body

  // Update the blog
  const updatedBlogData = {
  title: 'UPDATE test blog',
  author: 'UPDATE Test Author',
  url: 'https://updatedtest.com',
  likes: 9
  }

  // Send the PUT request to update the blog
  const putResponse = await api
  .put(`/api/blogs/${blogToUpdate.id}`)
  .send(updatedBlogData)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  // Check that the updated blog has the correct data
  expect(putResponse.body.title).toEqual(updatedBlogData.title)
  expect(putResponse.body.author).toEqual(updatedBlogData.author)
  expect(putResponse.body.url).toEqual(updatedBlogData.url)
  expect(putResponse.body.likes).toEqual(updatedBlogData.likes)

  // Delete the test blog
  await api.delete(`/api/blogs/${blogToUpdate.id}`).expect(204)
})
})

describe('DELETE /api/blogs/:id', () => {
  test('a blog can be deleted', async () => {
  // Define a new blog to be added
  const newBlog = {
  title: 'Test Blog for DELETE',
  author: 'Test Author',
  url: 'https://testblog.com',
  likes: 5,
  }
  // Add the new blog using a POST request
  const postResponse = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  // Get the ID of the new blog
  const blogToDelete = postResponse.body

  // Delete the test blog
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  // Check that the deleted blog is not in the list of blogs
  const updatedBlogs = await api.get('/api/blogs')
  const titles = updatedBlogs.body.map(blog => blog.title)
  expect(titles).not.toContain(blogToDelete.title)
  })
})


