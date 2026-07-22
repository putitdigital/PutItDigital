import { useEffect, useState } from "react";

function Profile({ user = {}, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    number: user.number || "",
    password: user.password || "",
    website: user.website || "",
    role: user.role || "",
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      number: user.number || "",
      password: user.password || "",
      website: user.website || "",
      role: user.role || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...user, ...formData });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
        backdropFilter: "blur(8px)"
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#51515118",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.2)",
          border: "solid 0.2px rgba(121, 121, 121, 0.39)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Edit profile</h3>
          <button type="button" onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 22, cursor: "pointer" }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>

          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Number
            <input
              name="number"
              rows="4"
              value={formData.number}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Password
            <input
              name="password"
              rows="4"
              value={formData.password}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Website
            <input
              name="website"
              rows="4"
              value={formData.website}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, color: "#334155", fontWeight: 600 }}>
            Role
            <input
              name="role"
              rows="4"
              value={formData.role}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: "10px 16px", borderRadius: 10 }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;