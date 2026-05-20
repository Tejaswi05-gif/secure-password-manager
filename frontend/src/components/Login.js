import React, { useState } from 'react';
import axios from 'axios';

function Login({ apiUrl, onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${apiUrl}/master/login`, { password });
      setPassword('');
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='box'>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='password'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>

      {error && <p className='error'>{error}</p>}
    </div>
  );
}

export default Login;
