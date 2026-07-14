import React, { useState } from 'react';
import './ComposePanel.css';

function ComposePanel({ credentials, onSend, onCancel, replyTo }) {
  const [to, setTo] = useState(replyTo?.from || '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!to.trim()) {
      setError('Recipient email is required');
      return;
    }

    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }

    if (!body.trim()) {
      setError('Message body is required');
      return;
    }

    setSending(true);
    await onSend({ to: to.trim(), subject: subject.trim(), body: body.trim() });
    setSending(false);
  };

  return (
    <div className="compose-panel">
      <div className="compose-header">
        <h2>Compose Email</h2>
        <button className="close-compose-btn" onClick={onCancel}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="compose-form">
        {error && <div className="compose-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="to">To:</label>
          <input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            disabled={sending}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            disabled={sending}
            required
          />
        </div>

        <div className="form-group message-group">
          <label htmlFor="body">Message:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message here..."
            disabled={sending}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={sending} className="send-btn">
            {sending ? '⏳ Sending...' : '✓ Send'}
          </button>
          <button type="button" onClick={onCancel} disabled={sending} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComposePanel;
