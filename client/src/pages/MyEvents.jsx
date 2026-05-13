import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyEvents() {
  const { API } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/registrations/my`);
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, [API]);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel this registration?')) return;
    setActionLoading(eventId); setError(''); setMessage('');
    try {
      await axios.delete(`${API}/registrations/${eventId}`);
      setMessage('Registration cancelled.');
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading('');
    }
  };

  const statusMap = { upcoming: 'registered', completed: 'completed', cancelled: 'cancelled' };
  const filtered = registrations.filter((r) => r.status === statusMap[tab]);

  const tabStyle = (t) => ({
    padding: '8px 20px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9rem',
    cursor: 'pointer', border: 'none', transition: 'all 0.2s',
    background: tab === t ? 'var(--primary)' : 'transparent',
    color: tab === t ? 'white' : 'var(--text-muted)',
  });

  return (
    <div className="page-container">
      <h1 className="page-title">My Events</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--white)', padding: '6px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', width: 'fit-content' }}>
        {['upcoming', 'completed', 'cancelled'].map((t) => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 16 }}>No {tab} events.</p>
          {tab === 'upcoming' && <Link to="/events" className="btn btn-primary">Browse Events</Link>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((reg) => {
            const ev = reg.event;
            if (!ev) return null;
            const date = new Date(ev.eventDate);
            const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const isPast = new Date() >= date;

            return (
              <div key={reg._id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 56, textAlign: 'center', padding: '8px', background: 'var(--primary-bg)', borderRadius: 'var(--radius)', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1 }}>
                    {date.getDate()}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{ev.title}</h3>
                    {reg.status === 'registered' && <span className="badge-pill badge-registered">Registered</span>}
                    {reg.status === 'completed' && <span className="badge-pill badge-completed">Completed</span>}
                    {reg.status === 'cancelled' && <span className="badge-pill badge-cancelled">Cancelled</span>}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    📅 {formatted} at {ev.eventTime} &nbsp;|&nbsp; 📍 {ev.location}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link to={`/events/${ev._id}`} className="btn btn-outline btn-sm">Details</Link>
                  {reg.status === 'registered' && !isPast && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(ev._id)} disabled={actionLoading === ev._id}>
                      {actionLoading === ev._id ? '...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
