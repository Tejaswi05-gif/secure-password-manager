import React, { useState } from 'react';
import axios from 'axios';

function AddPassword({ apiUrl, onPasswordAdded }) {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/passwords`, {
        website,
        username,
        password
      });

      onPasswordAdded(response.data);
      setWebsite('');
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add password');
    }
  };

  return (
    <div className='box'>
      <h2>Add Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Website'
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Add</button>
      </form>

      {error && <p className='error'>{error}</p>}
    </div>
  );
}

export default AddPassword;
