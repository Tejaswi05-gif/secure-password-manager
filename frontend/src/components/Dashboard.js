import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewPasswords from './ViewPasswords';
import AddPassword from './AddPassword';

function Dashboard({ apiUrl }) {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPasswords = async () => {
      try {
        const response = await axios.get(`${apiUrl}/passwords`);
        setPasswords(response.data);
      } catch (err) {
        setError('Unable to load saved passwords');
      }
    };

    loadPasswords();
  }, [apiUrl]);

  const handlePasswordAdded = (password) => {
    setPasswords((currentPasswords) => [password, ...currentPasswords]);
  };

  return (
    <div className='dashboard'>
      <h1>Password Manager Dashboard</h1>

      {error && <p className='error'>{error}</p>}

      <ViewPasswords passwords={passwords} />
      <AddPassword apiUrl={apiUrl} onPasswordAdded={handlePasswordAdded} />
    </div>
  );
}

export default Dashboard;
