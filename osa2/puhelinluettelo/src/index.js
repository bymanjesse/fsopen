import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios'
import './index.css'


const promise = 
axios
  .get('http://localhost:3001/api/persons')
  console.log(promise)
  


//testi database hakemiselle
//const promise2 = axios.get('http://localhost:3001/foobar')
//console.log(promise2)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


