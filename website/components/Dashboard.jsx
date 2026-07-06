function Dashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <h1>Welcome back</h1>
        <p>Here is your dashboard overview and quick access to your active work.</p>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Active Projects</h2>
          <p>10 live projects in production.</p>
        </article>

        <article className="dashboard-card">
          <h2>Pending Tasks</h2>
          <p>5 items awaiting review.</p>
        </article>

        <article className="dashboard-card">
          <h2>Revenue</h2>
          <p>Tracking performance and growth metrics.</p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
