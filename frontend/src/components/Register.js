import React, { useState } from 'react';
import axios from 'axios';

function Register({ apiUrl, onRegistered }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${apiUrl}/master/register`, { password });
      setPassword('');
      onRegistered();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='box'>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='password'
          placeholder='Create Master Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Register</button>
      </form>

      {error && <p className='error'>{error}</p>}
    </div>
  );
}

export default Register;
