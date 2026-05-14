import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  title: '', description: '', eventDate: '', eventTime: '',
  location: '', volunteerLimit: '', requirements: '', category: 'General', status: 'upcoming',
};
const CATEGORIES = ['General', 'Career Fair', 'Community Service', 'Fundraising', 'Campus Event', 'Other'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'postponed', 'cancelled'];

export default function AdminDashboard() {
  const { API } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/events`);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [API]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setError(''); setMessage(''); setShowForm(true); };

  const openEdit = (ev) => {
    setForm({
      title: ev.title, description: ev.description, eventDate: ev.eventDate.slice(0, 10),
      eventTime: ev.eventTime, location: ev.location, volunteerLimit: ev.volunteerLimit,
      requirements: ev.requirements || '', category: ev.category || 'General', status: ev.status,
    });
    setEditId(ev._id); setError(''); setMessage(''); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      if (editId) {
        await axios.put(`${API}/events/${editId}`, form);
        setMessage('Event updated successfully!');
      } else {
        await axios.post(`${API}/events`, form);
        setMessage('Event created successfully!');
      }
      setShowForm(false); setEditId(null); fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/events/${id}`);
      setMessage('Event deleted.'); fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/events/${id}`, { status }); fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Create Event</button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{editId ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Spring Career Fair" />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the event..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" name="eventTime" value={form.eventTime} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Sacramento State University Union" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div className="form-group">
                  <label>Volunteer Limit *</label>
                  <input type="number" name="volunteerLimit" value={form.volunteerLimit} onChange={handleChange} required min={1} placeholder="e.g. 20" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {editId && (
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Requirements (optional)</label>
                <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={2} placeholder="e.g. Must wear closed-toe shoes" style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Event' : 'Create Event'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No events yet.</p>
          <button className="btn btn-primary" onClick={openCreate}>Create Your First Event</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map((ev) => {
            const date = new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={ev._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{ev.title}</span>
                    <span className={`badge-pill badge-${ev.status}`}>{ev.status}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    📅 {date} at {ev.eventTime} &nbsp;|&nbsp; 📍 {ev.location} &nbsp;|&nbsp;
                    👥 {ev.spotsRemaining}/{ev.volunteerLimit} spots
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
                  <select value={ev.status} onChange={(e) => handleStatusChange(ev._id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary-border)', fontSize: '0.85rem', cursor: 'pointer' }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(ev)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev._id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
