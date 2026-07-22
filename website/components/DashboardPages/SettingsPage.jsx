import "./SettingsPage.css";

function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-container">
        {/* Account Settings */}
        <div className="settings-section">
          <h2>Account Settings</h2>
          <form className="settings-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value="admin@example.com" readOnly />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value="Admin User" />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value="Your Company" />
            </div>
            <button type="button" className="btn-primary">Save Changes</button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <h2>Security & Privacy</h2>
          <form className="settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button type="button" className="btn-primary">Update Password</button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="settings-form">
            <div className="toggle-group">
              <label className="toggle-item">
                <input type="checkbox" defaultChecked />
                <span>Email notifications for new projects</span>
              </label>
            </div>
            <div className="toggle-group">
              <label className="toggle-item">
                <input type="checkbox" defaultChecked />
                <span>Email notifications for user activity</span>
              </label>
            </div>
            <div className="toggle-group">
              <label className="toggle-item">
                <input type="checkbox" />
                <span>Email notifications for system updates</span>
              </label>
            </div>
            <div className="toggle-group">
              <label className="toggle-item">
                <input type="checkbox" defaultChecked />
                <span>Weekly summary report</span>
              </label>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="settings-section">
          <h2>API & Integrations</h2>
          <div className="api-key-section">
            <p>Your API Key (keep this secret)</p>
            <div className="api-key-display">
              <input type="text" value="sk_live_51H3Z9A4jS5nKlrX3gkH2j0bMxYz9pQ1r2sT3u4vW5x6yZ7" readOnly />
              <button type="button" className="btn-small btn-copy">Copy</button>
            </div>
          </div>
          <button type="button" className="btn-small btn-secondary">Regenerate Key</button>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h2>Danger Zone</h2>
          <p>Actions here cannot be undone</p>
          <button type="button" className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
