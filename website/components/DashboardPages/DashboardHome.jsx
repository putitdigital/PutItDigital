import { useState, useEffect } from "react";
import api from "../../api/api";
import "./DashboardHome.css";

function DashboardHome() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError(err.response?.data?.error || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const totalVisits = clients.reduce((sum, c) => sum + (c.visits || 0), 0);
  const totalUsers = clients.reduce((sum, c) => sum + (c.users || 0), 0);
  const totalRevenue = clients.reduce((sum, c) => {
    const amount = parseInt(String(c.revenue || 0).replace(/\D/g, ""));
    return sum + amount;
  }, 0);

  // Helper function to safely get status class
  const getStatusClass = (status) => {
    const defaultStatus = "active";
    const statusStr = String(status || defaultStatus).toLowerCase().trim();
    return `status-${statusStr}`;
  };

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's your business summary.</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Total Websites</h3>
            <p className="metric-value">{clients.length}</p>
            <span className="metric-label">Active Projects</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Users</h3>
            <p className="metric-value">{totalUsers}</p>
            <span className="metric-label">Across all sites</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Total Visits</h3>
            <p className="metric-value">{totalVisits.toLocaleString()}</p>
            <span className="metric-label">This month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${totalRevenue.toLocaleString()}</p>
            <span className="metric-label">From all projects</span>
          </div>
        </div>
      </div>

      {/* Client Websites Table */}
      <div className="clients-section">
        <div className="section-header">
          <h2>Client Websites Performance</h2>
          <button className="btn-primary">+ Add New Project</button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="loading-message">Loading clients...</div>
        ) : (
          <div className="table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <tr key={client.id}>
                      <td className="project-name">{client.name}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(client.status)}`}>
                          {client.status || "Active"}
                        </span>
                      </td>
                      <td>{client.email || "N/A"}</td>
                      <td>{client.phone || "N/A"}</td>
                      <td className="website-link">
                        {client.website ? (
                          <a href={client.website} target="_blank" rel="noopener noreferrer">
                            {client.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="actions">
                        <button className="btn-small btn-view">View</button>
                        <button className="btn-small btn-edit">Edit</button>
                        <button className="btn-small btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🚀</div>
            <div className="activity-content">
              <h4>New Project Launched</h4>
              <p>Website went live</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <h4>New User Registered</h4>
              <p>On client platform</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">💬</div>
            <div className="activity-content">
              <h4>Support Ticket Resolved</h4>
              <p>Customer query addressed</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <h4>Monthly Report Generated</h4>
              <p>Performance metrics updated</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
