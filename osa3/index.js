require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const Contact = require('./models/contact')
const { NotFoundError, ValidationError, DuplicateError } = require('./errors');



const MONGODB_URI = process.env.MONGODB_URI;


// Yhdistetään MongoDB Atlas -tietokantaan
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true});

// Virheiden käsittely
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error instanceof NotFoundError) {
    return response.status(404).send({ error: error.message });
  } else if (error instanceof ValidationError) {
    return response.status(422).send({ error: error.message });
  } else if (error.name === 'ValidationError') {
    return response.status(422).send({ error: error.message });
  } else if (error instanceof DuplicateError) {
    return response.status(409).send({ error: error.message });
  }

  next(error);
};


// Kovakoodatut kontaktit
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



// Konsolilogit
app.use((req, res, next) => {
    if (req.method === 'POST') {
      console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    }
    next();
  });

// Kaikkien kontaktien haku
app.get('/api/persons', async (req, res) => {
  const contacts = await Contact.find({}, '-__v'); // <-- specify the name of the collection here, and exclude the __v field
  res.json(contacts);
});

// Infon haku
app.get('/info', async (req, res) => {
  const contactCount = await Contact.countDocuments();
  const time = new Date();
  const info = `<p>Phonebook has info for ${contactCount} people</p><p>${time}</p>`;
  res.send(info);
});

// Idllä haku
app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      throw new NotFoundError('Contact not found');
    }
  } catch (error) {
    next(error);
  }
});

// Syötetään kontakti
app.post('/api/persons', async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    throw new ValidationError('Name or number missing');
  }

  try {
    const duplicateName = await Contact.findOne({ name: body.name });

    if (duplicateName) {
      throw new DuplicateError('Name already exists in contacts');
    }

    const newContact = new Contact({
      name: body.name,
      number: body.number,
    });

    const savedContact = await newContact.save();
    res.json(savedContact);
  } catch (error) {
    next(error);
  }
});

// Päivitetään olemassa oleva kontakti
app.put('/api/persons/:id', async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    throw new ValidationError('Name or number missing');
  }

  const contactToUpdate = {
    name: body.name,
    number: body.number,
  };

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      contactToUpdate,
      { new: true, runValidators: true, context: 'query' }
    );

    if (updatedContact) {
      res.json(updatedContact);
    } else {
      throw new NotFoundError('Contact not found');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(error.message);
    } else if (error instanceof NotFoundError) {
      next(error);
    } else {
      next(error);
    }
  }
});


// Poistetaan kontakti
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