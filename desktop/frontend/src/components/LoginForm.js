import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imapHost, setImapHost] = useState('fennec.aserv.co.za');
  const [smtpHost, setSmtpHost] = useState('fennec.aserv.co.za');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Test connection with backend
      const response = await fetch('http://localhost:5001/api/health');
      if (!response.ok) {
        throw new Error('Backend not running');
      }

      onLogin({
        email,
        password,
        imapHost,
        imapPort: 993,
        smtpHost,
        smtpPort: 465,
      });
    } catch (err) {
      setError(err.message || 'Connection failed. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Email Client</h1>
        <p className="subtitle">cPanel Email Access</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourdomain.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imapHost">IMAP Host</label>
            <input
              id="imapHost"
              type="text"
              value={imapHost}
              onChange={(e) => setImapHost(e.target.value)}
              placeholder="fennec.aserv.co.za"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="smtpHost">SMTP Host</label>
            <input
              id="smtpHost"
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              placeholder="fennec.aserv.co.za"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Connecting...' : 'Login'}
          </button>
        </form>

        <div className="help-text">
          <p>Get your mail server details from your cPanel account.</p>
          <p>Usually: fennec.aserv.co.za (port 993 for IMAP, 465 for SMTP)</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
