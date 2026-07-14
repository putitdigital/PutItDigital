import React, { useState, useEffect } from 'react';
import './EmailClient.css';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import EmailListPanel from './EmailListPanel';
import EmailViewPanel from './EmailViewPanel';
import ComposePanel from './ComposePanel';

function EmailClient({ credentials, onLogout }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'compose'
  const [mailboxes, setMailboxes] = useState([]);
  const [selectedMailbox, setSelectedMailbox] = useState('INBOX');
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [showUserProfile, setShowUserProfile] = useState(false);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchMailboxes();
    fetchEmails();
  }, [selectedMailbox]);

  const fetchMailboxes = async () => {
    try {
      const response = await fetch(`${API_URL}/email/mailboxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentials }),
      });
      const data = await response.json();
      if (data.mailboxes) {
        setMailboxes(data.mailboxes);
      }
    } catch (err) {
      console.error('Fetch mailboxes error:', err);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    setSelectedEmail(null);
    try {
      const response = await fetch(`${API_URL}/email/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials,
          mailbox: selectedMailbox,
          count: 50,
        }),
      });
      const data = await response.json();
      if (data.emails) {
        setEmails(data.emails);
      } else {
        setError(data.error || 'Failed to fetch emails');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setRefreshing(false);
  };

  const handleSendEmail = async (emailData) => {
    try {
      const response = await fetch(`${API_URL}/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials,
          ...emailData,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setView('list');
        setError('');
        await fetchEmails();
      } else {
        setError(data.error || 'Failed to send email');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleReply = () => {
    setView('compose');
  };

  const handleNewCompose = () => {
    setSelectedEmail(null);
    setView('compose');
  };

  const handleCancelCompose = () => {
    setView('list');
  };

  const handleToggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleOpenUserProfile = () => setShowUserProfile(true);
  const handleCloseUserProfile = () => setShowUserProfile(false);

  // Sort emails by date
  const sortedEmails = [...emails].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="email-client">
      <Sidebar
        credentials={credentials}
        selectedMailbox={selectedMailbox}
        mailboxes={mailboxes}
        onSelectMailbox={setSelectedMailbox}
        onCompose={handleNewCompose}
        onRefresh={handleRefresh}
        onLogout={onLogout}
        onOpenProfile={handleOpenUserProfile}
        refreshing={refreshing}
      />

      {showUserProfile && (
        <div className="modal-backdrop" onClick={handleCloseUserProfile}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseUserProfile}>
              ×
            </button>
            <UserProfile user={credentials} />
          </div>
        </div>
      )}

      <div className="main-panel">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {view === 'list' && (
          <div className="email-view-container">
            <EmailListPanel
              emails={sortedEmails}
              selectedEmail={selectedEmail}
              loading={loading}
              onSelectEmail={handleSelectEmail}
              sortOrder={sortOrder}
              onToggleSort={handleToggleSort}
            />

            {selectedEmail && (
              <EmailViewPanel
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onReply={handleReply}
                onNext={() => {
                  const currentIndex = sortedEmails.findIndex(e => e.id === selectedEmail.id);
                  if (currentIndex < sortedEmails.length - 1) {
                    setSelectedEmail(sortedEmails[currentIndex + 1]);
                  }
                }}
                onPrev={() => {
                  const currentIndex = sortedEmails.findIndex(e => e.id === selectedEmail.id);
                  if (currentIndex > 0) {
                    setSelectedEmail(sortedEmails[currentIndex - 1]);
                  }
                }}
              />
            )}
          </div>
        )}

        {view === 'compose' && (
          <ComposePanel
            credentials={credentials}
            onSend={handleSendEmail}
            onCancel={handleCancelCompose}
            replyTo={selectedEmail}
          />
        )}
      </div>
    </div>
  );
}

export default EmailClient;
