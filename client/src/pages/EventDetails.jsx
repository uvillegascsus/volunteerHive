import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [myReg, setMyReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const { data: ev } = await axios.get(`${API}/events/${id}`);
    setEvent(ev);
    if (user) {
      const { data: regs } = await axios.get(`${API}/registrations/my`);
      setMyReg(regs.find((r) => r.event?._id === id || r.event?._id?.toString() === id) || null);
    }
  };

  useEffect(() => {
    refresh().catch(() => navigate('/events')).finally(() => setLoading(false));
  }, [id, user, API]);





const handleRegister = async () => {
    if (!user) return navigate('/login'); 
    setActionLoading(true); setError(''); setMessage('');


    try {
      await axios.post(`${API}/registrations/${id}`);
      setMessage('Successfully registered!');
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };
  
const handleCancel = async () => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    setActionLoading(true); setError(''); setMessage('');
    try {
      await axios.delete(`${API}/registrations/${id}`);
      setMessage('Registration cancelled.');
      const { data: ev } = await axios.get(`${API}/events/${id}`);
      setEvent(ev); setMyReg(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };
  if (loading) return <div className="spinner" />;
  if (!event) return null;

  const date = new Date(event.eventDate);
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  

  const isPast = new Date() >= date;
  const isFull = event.spotsRemaining === 0;
  
  const isRegistered = myReg?.status === 'registered';
  const isCompleted = myReg?.status === 'completed';

  //ANAHI 

    const buttonState = () => {
    if (!user) return { label: 'Sign In to Register', action: () => navigate('/login'), cls: 'btn-outline' };
    if (isCompleted) return { label: '✅ Completed', action: null, cls: 'btn-success', disabled: true };
    if (isRegistered) return { label: 'Cancel Registration', action: handleCancel, cls: 'btn-danger' };
    if (isPast || event.status !== 'upcoming') return { label: 'Event Closed', action: null, cls: 'btn-outline', disabled: true };
    if (isFull) return { label: 'Event Full', action: null, cls: 'btn-outline', disabled: true };
    return { label: 'Sign Up', action: handleRegister, cls: 'btn-primary' };
    };

    const btn = buttonState();

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--primary-dark)', fontWeight: 600 }}>
        ← Back to Events
      </Link>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)', flex: 1 }}>{event.title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {isRegistered && <span className="badge-pill badge-registered">Registered</span>}
            {isCompleted && <span className="badge-pill badge-completed">Completed</span>}
            {isFull && !isRegistered && <span className="badge-pill badge-full">Full</span>}
            {!isFull && event.status === 'upcoming' && !isRegistered && <span className="badge-pill badge-available">Available</span>}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24, fontSize: '0.95rem' }}>
          <div><strong>Date</strong><p style={{ color: 'var(--text-muted)', marginTop: 2 }}>📅 {formatted}</p></div>
          <div><strong>Time</strong><p style={{ color: 'var(--text-muted)', marginTop: 2 }}>🕐 {event.eventTime}</p></div>
          <div><strong>Location</strong><p style={{ color: 'var(--text-muted)', marginTop: 2 }}>📍 {event.location}</p></div>
          {/* === Kayla starts here (SCRUM-30: display spots remaining / volunteer count) === */}
          <div>
            <strong>Capacity</strong>
            <p style={{ color: 'var(--text-muted)', marginTop: 2 }}>👥 {event.spotsRemaining} / {event.volunteerLimit} spots remaining</p>
          </div>
          {/* === Kayla ends here === */}
          {event.category && <div><strong>Category</strong><p style={{ color: 'var(--text-muted)', marginTop: 2 }}>🏷️ {event.category}</p></div>}
          <div>
            <strong>Posted by</strong>
            <p style={{ color: 'var(--text-muted)', marginTop: 2 }}>{event.createdBy?.firstName} {event.createdBy?.lastName}</p>
          </div>
        </div>

        <hr className="divider" />

        <div style={{ marginBottom: 20 }}>
          <strong style={{ fontSize: '1rem' }}>Description</strong>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 8 }}>{event.description}</p>
        </div>

        {event.requirements && (
          <div style={{ marginBottom: 24 }}>
            <strong style={{ fontSize: '1rem' }}>Requirements</strong>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 8 }}>{event.requirements}</p>
          </div>
        )}

        //ANAHI 
        
         <button className={`btn ${btn.cls}`} onClick={btn.action} disabled={btn.disabled || actionLoading} style={{ width: '100%', padding: '12px' }}>
          {actionLoading ? 'Processing...' : btn.label}
        </button>

         </div>
    </div>
  );
}
  