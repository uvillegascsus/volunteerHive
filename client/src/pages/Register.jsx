import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import beesImg from '../assets/bees.png';

export default function Register() {
  const { register, API } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', role: 'student', graduationYear: '', major: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/send-code`, form);
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/register`, { email: form.email, code });
      register(data);
      navigate(data.user.role === 'admin' ? '/admin' : '/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={beesImg} alt="VolunteerHive" style={{ height: 56, objectFit: 'contain' }} />
          <h2 style={{ fontWeight: 800, color: 'var(--primary-dark)', marginTop: 8, fontSize: '1.6rem' }}>
            {step === 'form' ? 'Create Account' : 'Verify Your Email'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            {step === 'form'
              ? 'Join VolunteerHive with your Sac State email'
              : `We sent a 6-digit code to ${form.email}`}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 'form' ? (
          <form onSubmit={handleSendCode}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" placeholder="First" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" placeholder="Last" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Sac State Email</label>
              <input type="email" name="email" placeholder="you@csus.edu" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student / Volunteer</option>
                <option value="admin">Admin (Career Center Staff)</option>
              </select>
            </div>

            {form.role === 'student' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div className="form-group">
                  <label>Graduation Year</label>
                  <input type="number" name="graduationYear" placeholder="2026" value={form.graduationYear} onChange={handleChange} min="2024" max="2030" />
                </div>
                <div className="form-group">
                  <label>Major</label>
                  <input name="major" placeholder="e.g. Computer Science" value={form.major} onChange={handleChange} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                style={{ fontSize: '1.4rem', letterSpacing: '8px', textAlign: 'center' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: 10 }}
              onClick={() => { setStep('form'); setCode(''); setError(''); }}>
              Back
            </button>
          </form>
        )}

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
