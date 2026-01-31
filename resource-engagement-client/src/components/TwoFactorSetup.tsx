import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { type TwoFactorSetup as TwoFactorSetupData, EnableTwoFactorRequest } from '../types';
import { apiService } from '../services/api';

const TwoFactorSetup: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify'>('setup');

  useEffect(() => {
    const fetchSetupData = async () => {
      setLoading(true);
      try {
        const data = await apiService.get2FASetup();
        setSetupData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load 2FA setup');
      } finally {
        setLoading(false);
      }
    };

    fetchSetupData();
  }, []);

  const handleEnableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const enableData: EnableTwoFactorRequest = {
        code: verificationCode,
      };
      
      await apiService.enable2FA(enableData);
      await refreshProfile();
      setSuccess('Two-factor authentication has been enabled successfully!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (user?.twoFactorEnabled) {
    return (
      <div className="twofa-container">
        <div className="twofa-content">
          <h2>Two-Factor Authentication</h2>
          <p className="success">Two-factor authentication is already enabled for your account.</p>
          <a href="/dashboard" className="btn">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  if (loading && !setupData) {
    return (
      <div className="twofa-container">
        <div className="loading">Loading 2FA setup...</div>
      </div>
    );
  }

  return (
    <div className="twofa-container">
      <div className="twofa-content">
        <div className="twofa-header">
          <h2>Setup Two-Factor Authentication</h2>
          <a href="/dashboard" className="back-link">← Back to Dashboard</a>
        </div>

        {step === 'setup' && setupData && (
          <div className="setup-step">
            <div className="step-header">
              <h3>Step 1: Scan QR Code</h3>
              <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
            </div>

            <div className="qr-section">
              {setupData.qrCodeImage && (
                <div className="qr-code">
                  <img 
                    src={setupData.qrCodeImage} 
                    alt="2FA QR Code" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
              
              <div className="manual-entry">
                <h4>Manual Entry</h4>
                <p>If you can't scan the QR code, enter this key manually:</p>
                <code className="manual-key">{setupData.manualEntryKey}</code>
              </div>
            </div>

            <button 
              className="btn" 
              onClick={() => setStep('verify')}
            >
              Next: Verify Setup
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="verify-step">
            <div className="step-header">
              <h3>Step 2: Verify Setup</h3>
              <p>Enter the 6-digit code from your authenticator app to complete the setup</p>
            </div>

            <form onSubmit={handleEnableTwoFactor}>
              <div className="form-group">
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="button-group">
                <button 
                  type="button" 
                  onClick={() => setStep('setup')}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn">
                  {loading ? 'Verifying...' : 'Enable 2FA'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;