import "./ProjectsPage.css";

function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Centia's Cleaning Services",
      client: "Centia",
      status: "Active",
      progress: 100,
      team: 3,
      startDate: "2024-01-15",
      deadline: "2024-02-28",
    },
    {
      id: 2,
      name: "RyDerm Platform",
      client: "RyDerm",
      status: "Active",
      progress: 85,
      team: 5,
      startDate: "2024-01-20",
      deadline: "2024-03-15",
    },
    {
      id: 3,
      name: "OKTik Social Network",
      client: "OKTik",
      status: "Active",
      progress: 92,
      team: 7,
      startDate: "2023-12-01",
      deadline: "2024-04-01",
    },
    {
      id: 4,
      name: "FlowIT Management",
      client: "FlowIT",
      status: "In Progress",
      progress: 65,
      team: 4,
      startDate: "2024-03-05",
      deadline: "2024-04-30",
    },
    {
      id: 5,
      name: "Switch App",
      client: "Switch",
      status: "Active",
      progress: 78,
      team: 3,
      startDate: "2024-02-10",
      deadline: "2024-03-31",
    },
  ];

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects Management</h1>
          <p>Track and manage all client projects</p>
        </div>
        <button className="btn-primary">+ New Project</button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status-badge status-${project.status.toLowerCase().replace(" ", "-")}`}>
                {project.status}
              </span>
            </div>

            <p className="project-client">{project.client}</p>

            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Team</span>
                <span className="meta-value">{project.team} members</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Start</span>
                <span className="meta-value">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span className="progress-percent">{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>

            <p className="deadline">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>

            <div className="project-actions">
              <button className="btn-small btn-view">View</button>
              <button className="btn-small btn-edit">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
