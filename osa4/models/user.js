const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.set('strictQuery', false)

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.pre('save', async function (next) {
  const saltRounds = 10
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.password
    }
  })

module.exports = mongoose.models.User || mongoose.model('User', userSchema)

