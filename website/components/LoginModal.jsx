import { createPortal } from "react-dom";

export default function LoginModal({
  credentials,
  onChange,
  onSubmit,
  onClose,
  error,
  isSubmitting,
}) {
  const modal = (
    <div className="login-overlay">
      <div className="login-panel">
        <form onSubmit={onSubmit} className="login-form">
          <h2>Login</h2>

          <label>
            Email
            <input
              type="email"
              value={credentials.email}
              required
              onChange={(event) =>
                onChange({ ...credentials, email: event.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              required
              onChange={(event) =>
                onChange({ ...credentials, password: event.target.value })
              }
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <div className="login-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Checking..." : "Login"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
