const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Määritellään yhteystietojen skeema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        if (/^\d{2}-\d{5,}$/.test(v)) {
          // Jos 2 niin 6 toisessa osassa
          return /^\d{2}-\d{6,}$/.test(v);
        } else {
          // Muuten toisessa osassa 5
          return /^\d{3}-\d{5,}$/.test(v);
        }
      },
      message: props =>
        `${props.value} is not a valid phone number. Phone numbers should consist of two parts separated by a "-", with the first part having 2-3 characters and the second part having at least 5 or 6 characters depending on the length of the first part.`,
    },
  },
}, { collection: 'contacts' });

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)