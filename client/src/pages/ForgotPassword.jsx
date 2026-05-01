import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { API } = useAuth();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/forgot-password`, { email });
      setMessage(data.message);
      setStep('token');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password/${token}`, { password: newPassword });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: '2.2rem' }}>🔒</span>
          <h2 style={{ fontWeight: 800, color: 'var(--primary-dark)', marginTop: 8, fontSize: '1.6rem' }}>Reset Password</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {step === 'email' && (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label>Your Sac State Email</label>
              <input type="email" placeholder="you@csus.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Request Reset'}
            </button>
          </form>
        )}

        {step === 'token' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Reset Token</label>
              <input placeholder="Paste the token above" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div className="alert alert-success">Password reset successfully!</div>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>Back to Sign In</Link>
          </div>
        )}

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          <Link to="/login">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
