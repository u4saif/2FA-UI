import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { TOTPVerification } from '../components/TOTPVerification';
import { useAuth } from '../context/AuthContext';

export const VerifyTOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [error, setError] = useState('');
  const email = localStorage.getItem('pendingEmail');

  const handleSuccess = (accessToken: string) => {
    setToken(accessToken);
    setUser({
      id: 0,
      email: email || '',
      totpEnabled: true,
    });
    localStorage.removeItem('tempToken');
    localStorage.removeItem('pendingEmail');
    navigate('/dashboard');
  };

  if (!email) {
    return (
      <AuthLayout title="Error" subtitle="Invalid session">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle className="inline mr-2" size={20} />
          Session expired. Please login again.
        </div>
        <button
          onClick={() => navigate('/login')}
          className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Back to Login
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the code from your authenticator app"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-6">
        <Shield size={24} />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle className="inline mr-2" size={20} />
          {error}
        </div>
      )}

      <TOTPVerification
        onSuccess={handleSuccess}
        email={email}
        isSetup={false}
      />

      <button
        onClick={() => navigate('/login')}
        className="w-full mt-4 px-4 py-2 text-primary-600 hover:text-primary-700 transition"
      >
        Use a different account
      </button>
    </AuthLayout>
  );
};
