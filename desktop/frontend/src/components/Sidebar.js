import React from 'react';
import './Sidebar.css';

function Sidebar({
  credentials,
  selectedMailbox,
  mailboxes,
  onSelectMailbox,
  onCompose,
  onRefresh,
  onLogout,
  onOpenProfile,
  refreshing,
}) {
  return (
    
    <aside className="sidebar">
      <div className="sidebar-header">
        <div
          className="user-info"
          onClick={onOpenProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (!onOpenProfile) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenProfile();
            }
          }}
        >
          <div className="user-avatar">{credentials.email.charAt(0).toUpperCase()}</div>
          <div className="user-email">{credentials.email}</div>
        </div>
      </div>

      <button className="compose-btn" onClick={onCompose}>
        ✏️ Compose
      </button>

      <button
        className="refresh-btn"
        onClick={onRefresh}
        disabled={refreshing}
        title="Refresh emails"
      >
        {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
      </button>

      <nav className="mailboxes-nav">
        <h3 className="nav-title">Mailboxes</h3>
        <ul className="mailbox-list">
          {mailboxes.map((box) => (
            <li key={box.path}>
              <button
                className={`mailbox-btn ${selectedMailbox === box.path ? 'active' : ''}`}
                onClick={() => onSelectMailbox(box.path)}
              >
                <span className="mailbox-icon">📧</span>
                <span className="mailbox-name">{box.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
