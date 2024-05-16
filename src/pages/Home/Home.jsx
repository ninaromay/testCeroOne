import './Home.css'
import { useState, useEffect } from 'react'
import Contacts from '../../components/Contacts/Contacts'

import axios from 'axios';


const  Home = () => {
  const [connected, setConnected] = useState([])

  useEffect(() => {
    fetch('http://localhost:9000/testAPI')
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        setConnected(response);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='home-container'>
      <p className='home-title'>Welcome!</p>
      <p className='home-title'>Api Status <span className='home-status'>{connected.value}</span></p>
    </div>
  )
}

export default Home