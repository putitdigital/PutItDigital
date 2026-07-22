import "./Profile.css"
function Profilenav({user = {}, onOpenProfile }) {
  const displayName = user.displayName || user.email || "User";
  const email = user.email || "";
  const initials = String(displayName).charAt(0).toUpperCase() || "U";

  return (
      <div className="nav-profile">
        <button
          type="button"
          onClick={onOpenProfile}
          style={{
            display: "flex",
            alignItems: "center",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: onOpenProfile ? "pointer" : "default",
          }}
        >
          <div className="profile">
            <div
              style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#0f172a",
              color: "#3f0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
            }}
            >
              {initials}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 10, textAlign: "left" }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{displayName}</span>
            {email ? <small style={{ color: "#64748b" }}>{email}</small> : null}
          </div>
        </button>
      </div>
  );
}

export default Profilenav;