// Vaaditaan mongoose-kirjasto
const mongoose = require('mongoose')

// Tarkistetaan, että komentoriviltä annettu salasana
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> <contact_name> <contact_number>')
  process.exit(1)
}

const password = process.argv[2]

const MONGODB_URI =
`mongodb+srv://jesseb:${password}@cluster0.emldk7r.mongodb.net/database?retryWrites=true&w=majority`

// Yhdistetään MongoDB Atlas -tietokantaan
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Määritellään yhteystietojen skeema
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

// Luodaan yhteystietomalli
const Contact = mongoose.model('Contact', contactSchema)

// Funktio satunnaisen ID:n luomiseen
const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Tulostetaan puhelinluettelo, jos ei ole annettu yhteystiedon nimeä ja numeroa
if (process.argv.length === 3) {
  console.log('Phonebook:')
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
} else {
// Lisätään uusi yhteystieto, kun annetaan yhteystiedon nimi ja numero
  const contactName = process.argv[3]
  const contactNumber = process.argv[4]

  const contact = new Contact({
    name: contactName,
    number: contactNumber,
    id: generateRandomId()
  })

  contact.save().then((result) => {
    console.log(`Added ${contactName} number ${contactNumber} to the phonebook.`)
    mongoose.connection.close()
  })
}
