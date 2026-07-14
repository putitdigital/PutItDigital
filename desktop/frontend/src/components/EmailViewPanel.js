import React from 'react';
import './EmailViewPanel.css';

function EmailViewPanel({ email, onBack, onReply, onNext, onPrev }) {
  const currentDate = new Date(email.date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="email-view-panel">
      <div className="view-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={onBack} title="Back to list">
            ← Back
          </button>
        </div>

        <div className="toolbar-center">
          <h3 className="toolbar-title">{email.subject || '(No Subject)'}</h3>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={onPrev} title="Previous email">
            ↑ Prev
          </button>
          <button className="toolbar-btn" onClick={onNext} title="Next email">
            Next ↓
          </button>
          <button className="toolbar-btn reply-btn" onClick={onReply} title="Reply">
            ↩️ Reply
          </button>
        </div>
      </div>

      <div className="email-view-content">
        <div className="email-headers">
          <div className="header-row">
            <div className="header-label">From:</div>
            <div className="header-value">{email.from}</div>
          </div>
          <div className="header-row">
            <div className="header-label">To:</div>
            <div className="header-value">{email.to}</div>
          </div>
          <div className="header-row">
            <div className="header-label">Date:</div>
            <div className="header-value">{currentDate}</div>
          </div>
        </div>

        <div className="email-divider"></div>

        <div className="email-body">
          {email.html ? (
            <div 
              className="email-html-content"
              dangerouslySetInnerHTML={{ __html: email.html }}
            />
          ) : (
            <div className="email-text-content">
              {email.text?.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailViewPanel;
