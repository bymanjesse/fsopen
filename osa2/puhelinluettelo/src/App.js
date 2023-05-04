import { useState, useEffect } from 'react';
import personsService from './services/persons';

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter by name: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const Persons = ({ persons, handleDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person) => (
          <tr key={person.id}>
            <td>{person.name}</td>
            <td>{person.number}</td>
            <td>
              <button onClick={() => handleDelete(person.id)}>delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const MessageDisplay = ({ message, isError }) => {
  console.log('message:', message);
  return message ? (
    <div className={`message ${isError ? 'error' : ''}`}>
      <p>{message}</p>
    </div>
  ) : null;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then((data) => {
        if (Array.isArray(data)) {
          setPersons(data);
        } else {
          console.error('Data received from the server is not an array:', data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the name is empty or consists only of whitespace characters
    if (newName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    // Check if the number is empty or consists only of whitespace characters
    if (newNumber.trim() === '') {
      alert('Number cannot be empty');
      return;
    }

    const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService
          .update(existingPerson.id, updatedPerson)
          .then((data) => {
            setPersons(persons.map((person) => (person.id === existingPerson.id ? data : person)));
            setMessage(`Updated ${data.name}`);
            setTimeout(() => setErrorMessage(null), 2000);
          })
          .catch((error) => {
            setErrorMessage(`${existingPerson.name} was already deleted from the server.`);
            setTimeout(() => setErrorMessage(null), 2000);
            console.log(error);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personsService
        .create(personObject)
        .then((data) => {
          setPersons(persons.concat(data));
          setMessage(`Added ${data.name}`);
          setTimeout(() => setMessage(null), 2000);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.data && error.response.data.error) {
            if (error.response.status === 422) { // Handle validation errors
              setErrorMessage("Phone number validation failed: " + error.response.data.error);
            } else if (error.response.status === 409) { // Handle duplicate errors
              setErrorMessage("Name already exists in contacts.");
            } else {
              setErrorMessage("An unknown11 error occurred.");
            }
          } else {
            setErrorMessage("An unknown error occurred.");
          }
          setTimeout(() => setErrorMessage(null), 5000);
        });

      setNewName("");
      setNewNumber("");
  }
};

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
  
    if (window.confirm('Are you sure you want to delete this person?')) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted ${personToDelete.name}`);
          setTimeout(() => setMessage(null), 2000);
        })
        .catch((error) => {
          setErrorMessage(`${personToDelete.name} was already deleted from the server.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        });
    }
  };

  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <MessageDisplay message={message} />
      <MessageDisplay message={errorMessage} isError />
      <h3>Add a new person</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      {persons.length > 0 ? <Persons persons={filteredPersons} handleDelete={handleDelete} /> : <div>Loading...</div>}
    </div>
  );
};

export default App;

