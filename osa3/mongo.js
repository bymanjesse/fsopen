const mongoose = require('mongoose');


if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <password> <contact_name> <contact_number>');
    process.exit(1);
  }

const password = process.argv[2];
    

const MONGODB_URI = 
`mongodb+srv://jesseb:${password}@cluster0.emldk7r.mongodb.net/database?retryWrites=true&w=majority`;


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});

const Contact = mongoose.model('Contact', contactSchema);

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

if (process.argv.length === 3) {
// Display the phonebook when no contact name and number are provided
console.log('Phonebook:');
Contact.find({}).then((result) => {
    result.forEach((contact) => {
    console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
});
} else {
// Add a new contact when both contact name and number are provided
const contactName = process.argv[3];
const contactNumber = process.argv[4];

const contact = new Contact({
  name: contactName,
  number: contactNumber,
  id: generateRandomId()
});

contact.save().then((result) => {
  console.log(`Added ${contactName} number ${contactNumber} to the phonebook.`);
  mongoose.connection.close();
});
}