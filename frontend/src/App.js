import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserRegistration from './components/UserRegistration';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkMasterPassword = async () => {
      try {
        const response = await axios.get(`${API_URL}/master/status`);
        setIsRegistered(response.data.registered);
      } catch (err) {
        setMessage('Backend is not reachable. Start the backend server first.');
      } finally {
        setLoading(false);
      }
    };

    checkMasterPassword();
  }, []);

  const handleRegistered = () => {
    setIsRegistered(true);
    setMessage('Master password registered. Please login.');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setMessage('');
  };

  if (loading) {
    return <p className='status'>Loading...</p>;
  }

  return (
    <main>
      <UserRegistration apiUrl={API_URL} />

      {message && <p className='status'>{message}</p>}

      {!isRegistered && <Register apiUrl={API_URL} onRegistered={handleRegistered} />}

      {isRegistered && !isLoggedIn && <Login apiUrl={API_URL} onLogin={handleLogin} />}

      {isLoggedIn && <Dashboard apiUrl={API_URL} />}
    </main>
  );
}

export default App;
