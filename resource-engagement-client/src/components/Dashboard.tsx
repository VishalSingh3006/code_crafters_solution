import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome, {user.firstName} {user.lastName}!
        </h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Your Profile</h2>
          <div className="user-details">
            <p>
              <strong>Title:</strong> {user.title}
            </p>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber || "Not provided"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "Not provided"}
            </p>
            <p>
              <strong>Zip Code:</strong> {user.zipCode || "Not provided"}
            </p>
            <p>
              <strong>2FA Enabled:</strong>{" "}
              {user.twoFactorEnabled ? "Yes" : "No"}
            </p>
          </div>

          <div className="action-buttons">
            <a href="/profile" className="btn">
              Edit Profile
            </a>
            {!user.twoFactorEnabled && (
              <a href="/2fa-setup" className="btn btn-secondary">
                Setup 2FA
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
