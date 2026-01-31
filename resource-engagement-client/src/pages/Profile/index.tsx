import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../store/authSlice";
import { UpdateProfileRequest } from "../../types";
import { profileService } from "../../services/profileService";
import { twoFactorService } from "../../services/twoFactorService";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    title: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [showTwoFactorDisable, setShowTwoFactorDisable] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || "",
        address: user.address,
        zipCode: user.zipCode,
      });
    }
  }, [user]);

  // Refresh profile only on component mount to get latest 2FA status
  useEffect(() => {
    (async () => {
      try {
        const profile = await profileService.getProfile();
        dispatch(setUser(profile));
      } catch {
        // ignore; errors will be shown by other mechanisms if needed
      }
    })();
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await profileService.updateProfile(formData);
      if (response.profile) {
        dispatch(setUser(response.profile));
      }
      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setError("Please enter your 2FA code to disable");
      return;
    }

    setError("");
    setSuccess("");
    setTwoFactorLoading(true);

    try {
      await twoFactorService.disable(twoFactorCode);
      if (user) {
        dispatch(setUser({ ...user, twoFactorEnabled: false }));
      }
      setSuccess("Two-factor authentication disabled successfully!");
      setShowTwoFactorDisable(false);
      setTwoFactorCode("");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <div className="profile-header">
          <h2>Edit Profile</h2>
          <a href="/dashboard" className="back-link">
            ← Back to Dashboard
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title:</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              >
                <option value="">Select Title</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>

            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Two-Factor Authentication Management */}
        <div className="two-factor-section">
          <h3>Two-Factor Authentication</h3>
          <div className="two-factor-status">
            <p>
              Status:{" "}
              <strong>{user?.twoFactorEnabled ? "Enabled" : "Disabled"}</strong>
            </p>

            {!user?.twoFactorEnabled ? (
              <div className="two-factor-actions">
                <p>
                  Enhance your account security by enabling two-factor
                  authentication.
                </p>
                <a href="/2fa-setup" className="btn btn-primary">
                  Enable 2FA
                </a>
              </div>
            ) : (
              <div className="two-factor-actions">
                {!showTwoFactorDisable ? (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setShowTwoFactorDisable(true)}
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <form
                    onSubmit={handleDisable2FA}
                    className="disable-2fa-form"
                  >
                    <p>
                      Enter your 2FA code to disable two-factor authentication:
                    </p>
                    <div className="form-group">
                      <input
                        type="text"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="submit"
                        disabled={twoFactorLoading}
                        className="btn btn-warning"
                      >
                        {twoFactorLoading ? "Disabling..." : "Disable 2FA"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTwoFactorDisable(false);
                          setTwoFactorCode("");
                          setError("");
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
