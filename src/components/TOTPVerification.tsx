import React, { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../api';

interface TOTPVerificationProps {
  onSuccess: (token: string) => void;
  email?: string;
  isSetup?: boolean;
}

export const TOTPVerification: React.FC<TOTPVerificationProps> = ({
  onSuccess,
  email,
  isSetup = false,
}) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSetup) {
        const response = await authAPI.verifyTOTPSetup(token);
        if (response.data.success) {
          onSuccess(token);
        } else {
          setError('Invalid TOTP code. Please try again.');
        }
      } else {
        const response = await authAPI.verifyTOTPLogin(email!, token);
        onSuccess(response.data.access_token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid TOTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter 6-Digit Code
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 font-mono"
          autoComplete="off"
        />
        <p className="text-xs text-gray-500 mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || token.length !== 6}
        className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
      >
        {loading ? <Loader size={20} className="animate-spin" /> : null}
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );
};
