import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { TOTPSetup } from '../components/TOTPSetup';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTOTPSetup, setShowTOTPSetup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTOTPStatus = async () => {
      try {
        const response = await authAPI.getTOTPStatus();
        setTotpEnabled(response.data.totpEnabled);
      } catch (err) {
        setError('Failed to check TOTP status');
      } finally {
        setLoading(false);
      }
    };

    checkTOTPStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDisableTOTP = async () => {
    if (window.confirm('Are you sure you want to disable 2FA?')) {
      try {
        await authAPI.disableTOTP();
        setTotpEnabled(false);
      } catch (err) {
        setError('Failed to disable 2FA');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="text-lg font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={24} className="text-primary-600" />
              Two-Factor Authentication
            </h2>

            {showTOTPSetup ? (
              <div className="space-y-4">
                <TOTPSetup
                  onSuccess={() => {
                    setShowTOTPSetup(false);
                    setTotpEnabled(true);
                  }}
                  onCancel={() => setShowTOTPSetup(false)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      totpEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className={totpEnabled ? 'text-green-700' : 'text-gray-700'}>
                    {totpEnabled ? '2FA is enabled' : '2FA is disabled'}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {totpEnabled
                    ? 'Your account is protected with two-factor authentication. A code from your authenticator app will be required to sign in.'
                    : 'Add an extra layer of security to your account with two-factor authentication.'}
                </p>

                <div className="flex gap-2">
                  {totpEnabled && (
                    <button
                      onClick={handleDisableTOTP}
                      className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Disable 2FA
                    </button>
                  )}
                  {!totpEnabled && (
                    <button
                      onClick={() => setShowTOTPSetup(true)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Enable 2FA
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Welcome to the Application</h3>
          <p className="text-primary-100">
            Your account is now fully set up and secure. You can manage your security settings above.
          </p>
        </div>
      </main>
    </div>
  );
};
