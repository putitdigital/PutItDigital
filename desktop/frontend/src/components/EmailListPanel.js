import React from 'react';
import './EmailListPanel.css';

function EmailListPanel({ emails, selectedEmail, loading, onSelectEmail, sortOrder, onToggleSort }) {
  if (loading) {
    return (
      <div className="email-list-panel">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading emails...</p>
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="email-list-panel">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No emails found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-list-panel">
      <div className="email-list-header">
        <div className="header-left">
          <h2>Inbox</h2>
          <span className="email-count">{emails.length}</span>
        </div>
        <button
          className="sort-btn"
          onClick={onToggleSort}
          title={`Sort by date: ${sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}`}
        >
          📅 {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </button>
      </div>

      <ul className="email-list">
        {emails.map((email) => (
          <li key={email.id}>
            <button
              className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
              onClick={() => onSelectEmail(email)}
            >
              <div className="email-item-header">
                <div className="email-from">{email.from}</div>
                <div className="email-date">
                  {new Date(email.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' '}
                  <span className="email-time">
                    {new Date(email.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="email-subject">{email.subject}</div>
              <div className="email-preview">
                {email.text?.substring(0, 120) || '(No content)'}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmailListPanel;
