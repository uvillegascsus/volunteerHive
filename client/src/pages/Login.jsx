import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import beesImg from '../assets/bees.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={beesImg} alt="VolunteerHive" style={{ height: 56, objectFit: 'contain' }} />
          <h2 style={{ fontWeight: 800, color: 'var(--primary-dark)', marginTop: 8, fontSize: '1.6rem' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Welcome back to VolunteerHive</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sac State Email</label>
            <input type="email" name="email" placeholder="you@csus.edu" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
