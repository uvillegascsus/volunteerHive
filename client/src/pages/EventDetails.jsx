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


  const isPast = new Date() >= date;
  const isFull = event.spotsRemaining === 0;
  
  const isRegistered = myReg?.status === 'registered';
  const isCompleted = myReg?.status === 'completed';
  

}

  const btn = buttonState();

          <div>
            <strong>Capacity</strong>
            <p style={{ color: 'var(--text-muted)', marginTop: 2 }}>👥 {event.spotsRemaining} / {event.volunteerLimit} spots remaining</p>
          </div>      