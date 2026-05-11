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