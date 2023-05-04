require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const Contact = require('./models/contact')



const MONGODB_URI = process.env.MONGODB_URI;


// Yhdistetään MongoDB Atlas -tietokantaan
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true});


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


const contacts = {
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]
};

// Cors middleware
app.use(cors())

//For Express to display static content - index.html
app.use(express.static('build'))

// Use morgan middleware to log HTTP requests to console
app.use(morgan('tiny'));

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to parse JSON in request body
app.use(express.json());

//Virheiden käsittelijä
app.use(errorHandler)



// Log HTTP POST requests to console and display data
app.use((req, res, next) => {
    if (req.method === 'POST') {
      console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    }
    next();
  });

  app.get('/api/persons', async (req, res) => {
    const contacts = await Contact.find({}, '-__v'); // <-- specify the name of the collection here, and exclude the __v field
    res.json(contacts);
  });

app.get('/info', async (req, res) => {
  const contactCount = await Contact.countDocuments();
  const time = new Date();
  const info = `<p>Phonebook has info for ${contactCount} people</p><p>${time}</p>`;
  res.send(info);
});


app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error))
});


app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  Contact.findOne({ name: body.name }).then(duplicateName => {
    if (duplicateName) {
      return res.status(400).json({ error: 'Name already exists in contacts' });
    }

    const newContact = new Contact({
      name: body.name,
      number: body.number,
    });

    newContact.save().then(savedContact => {
      res.json(savedContact);
    });
  });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log('Deletion result:', result);
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    })
    .catch(error => next(error));
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})