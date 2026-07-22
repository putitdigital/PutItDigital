import { useState } from "react";
import "./UsersPage.css";

function UsersPage() {
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      project: "Centia's Cleaning",
      role: "Admin",
      status: "Active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-28",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      project: "RyDerm",
      role: "Editor",
      status: "Active",
      joinDate: "2024-01-20",
      lastLogin: "2024-01-27",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      project: "OKTik",
      role: "Viewer",
      status: "Active",
      joinDate: "2024-02-01",
      lastLogin: "2024-01-26",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      project: "FlowIT",
      role: "Editor",
      status: "Inactive",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-15",
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom@example.com",
      project: "Switch",
      role: "Admin",
      status: "Active",
      joinDate: "2024-02-05",
      lastLogin: "2024-01-28",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      project: "RyDerm",
      role: "Viewer",
      status: "Active",
      joinDate: "2024-02-10",
      lastLogin: "2024-01-27",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage all users across your projects</p>
        </div>
        <button className="btn-primary">+ Add New User</button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-section">
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Project</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name">{user.name}</td>
                    <td className="user-email">{user.email}</td>
                    <td>{user.project}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                    <td className="actions">
                      <button className="btn-small btn-view">View</button>
                      <button className="btn-small btn-edit">Edit</button>
                      <button className="btn-small btn-delete">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="users-stats">
        <div className="stat-item">
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>
        <div className="stat-item">
          <h4>Active</h4>
          <p>{users.filter((u) => u.status === "Active").length}</p>
        </div>
        <div className="stat-item">
          <h4>Inactive</h4>
          <p>{users.filter((u) => u.status === "Inactive").length}</p>
        </div>
        <div className="stat-item">
          <h4>Admins</h4>
          <p>{users.filter((u) => u.role === "Admin").length}</p>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
