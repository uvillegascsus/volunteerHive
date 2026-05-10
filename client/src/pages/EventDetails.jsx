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
