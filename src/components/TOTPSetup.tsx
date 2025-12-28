import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../api';

interface TOTPSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface SetupData {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

export const TOTPSetup: React.FC<TOTPSetupProps> = ({ onSuccess, onCancel }) => {
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const setupTOTP = async () => {
      try {
        const response = await authAPI.setupTOTP();
        setSetupData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to setup TOTP');
      } finally {
        setLoading(false);
      }
    };

    setupTOTP();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    try {
      const response = await authAPI.verifyTOTPSetup(token);
      if (response.data.success) {
        setVerified(true);
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError('Invalid TOTP code. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (!setupData) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <AlertCircle className="inline mr-2" size={20} />
        {error || 'Failed to load TOTP setup'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Secure Your Account</h3>
        <p className="text-sm text-blue-700">
          Two-factor authentication adds an extra layer of security to your account.
        </p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Step 1: Scan with Your Authenticator App
          </h4>
          <div className="bg-white p-4 rounded-lg border border-gray-300 inline-block">
            <img src={setupData.qrCode} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Use Google Authenticator, Microsoft Authenticator, Authy, or similar apps
          </p>
        </div>
      </div>

      {/* Manual Entry Key */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Or enter this key manually:
        </h4>
        <div className="flex gap-2">
          <code className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
            {setupData.secret}
          </code>
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center gap-1"
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Verification */}
      <form onSubmit={handleVerify} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {verified && (
          <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <CheckCircle size={20} />
            <span>TOTP setup verified successfully!</span>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Step 2: Enter the 6-Digit Code
          </h4>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            disabled={verified}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 font-mono disabled:bg-gray-100"
            autoComplete="off"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            disabled={verifying || token.length !== 6 || verified}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {verifying ? <Loader size={20} className="animate-spin" /> : null}
            {verified ? 'Verified!' : 'Verify & Enable'}
          </button>
        </div>
      </form>
    </div>
  );
};
