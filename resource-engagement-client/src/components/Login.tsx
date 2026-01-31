import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginRequest, TwoFactorVerifyRequest } from '../types';
import { apiService } from '../services/api';

const Login: React.FC = () => {
  const { login, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [twoFactorData, setTwoFactorData] = useState<{
    required: boolean;
    email: string;
    code: string;
  }>({
    required: false,
    email: '',
    code: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      
      if (response.requiresTwoFactor) {
        setTwoFactorData({
          required: true,
          email: formData.email,
          code: '',
        });
      }
      // If no two-factor required, AuthContext handles navigation
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const verifyRequest: TwoFactorVerifyRequest = {
        email: twoFactorData.email,
        code: twoFactorData.code,
      };
      
      const response = await apiService.verify2FA(verifyRequest);
      // Properly handle the token and update AuthContext state
      if (response.token) {
        apiService.setAuthToken(response.token);
        await refreshProfile(); // This will update the user state in AuthContext
        // The AuthProvider will automatically redirect authenticated users
      }
    } catch (error: any) {
      // Stay on 2FA page and show error - don't reset twoFactorData
      setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
      // Clear only the code input, keep the 2FA form visible
      setTwoFactorData(prev => ({ ...prev, code: '' }));
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorData.required) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Two-Factor Authentication</h2>
          <p>Enter the 6-digit code from your authenticator app</p>
          
          <form onSubmit={handleTwoFactorSubmit}>
            <div className="form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={twoFactorData.code}
                onChange={(e) => setTwoFactorData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setTwoFactorData({ required: false, email: '', code: '' })}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;