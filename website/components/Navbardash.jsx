import "./Navbardash.css";

function Navbardash({ isLoggedIn, isLoggingIn, onLogin, onLogout,activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    // TODO: Call logout API
    window.location.reload();
  };

  return (
    <nav className="navbardash">
      <div className="navbardash-header">
        <h2>Dashboard</h2>
      </div>

      <ul className="navbardash-menu">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`navbardash-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="navbardash-icon">{tab.icon}</span>
              <span className="navbardash-label">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="navbardash-footer">
        <button
          className="btn-primary"
          onClick={isLoggedIn ? onLogout : onLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Checking..." : isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default Navbardash;
