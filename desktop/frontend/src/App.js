import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import EmailClient from './components/EmailClient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleLogin = (creds) => {
    setCredentials(creds);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials(null);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <EmailClient credentials={credentials} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
