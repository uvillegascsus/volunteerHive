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
}
  
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


  const isPast = new Date() >= date;
  const isFull = event.spotsRemaining === 0;
  
  const isRegistered = myReg?.status === 'registered';
  const isCompleted = myReg?.status === 'completed';

  const buttonState = () => {
    if (!user) return { label: 'Sign In to Register', action: () => navigate('/login'), cls: 'btn-outline' };
    if (isCompleted) return { label: '✅ Completed', action: null, cls: 'btn-success', disabled: true };
    if (isRegistered) return { label: 'Cancel Registration', action: handleCancel, cls: 'btn-danger' };
    if (isPast || event.status !== 'upcoming') return { label: 'Event Closed', action: null, cls: 'btn-outline', disabled: true };
    if (isFull) return { label: 'Event Full', action: null, cls: 'btn-outline', disabled: true };
    return { label: 'Sign Up', action: handleRegister, cls: 'btn-primary' };
  };
  

  {
    <button className={`btn ${btn.cls}`} onClick={btn.action} disabled={btn.disabled || actionLoading} style={{ width: '100%', padding: '12px' }}>
          {actionLoading ? 'Processing...' : btn.label}
        </button>
  }



  

}

