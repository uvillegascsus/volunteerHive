import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  padding: '10px 14px', border: '1.5px solid var(--primary-border)',
  borderRadius: 'var(--radius)', fontSize: '0.95rem', outline: 'none',
};

function statusBadge(event) {
  if (event.spotsRemaining === 0) return <span className="badge-pill badge-full">Full</span>;
  if (event.status === 'upcoming') return <span className="badge-pill badge-available">Available</span>;
  if (event.status === 'completed') return <span className="badge-pill badge-completed">Completed</span>;
  return <span className="badge-pill badge-upcoming">{event.status}</span>;
}

function EventCard({ event }) {
  const date = new Date(event.eventDate);
  const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.05rem', flex: 1 }}>{event.title}</h3>
        {statusBadge(event)}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>📅 {formatted} at {event.eventTime}</span>
        <span>📍 {event.location}</span>
        {/* === Kayla starts here (SCRUM-30: display current volunteer count per event) === */}
        <span>👥 {event.spotsRemaining} / {event.volunteerLimit} spots remaining</span>
        {/* === Kayla ends here === */}
        {event.category && <span>🏷️ {event.category}</span>}
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {event.description.length > 120 ? event.description.slice(0, 120) + '…' : event.description}
      </p>
      <Link to={`/events/${event._id}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
        View Details
      </Link>
    </div>
  );
}

export default function Events() {
  const { API } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filter) params.status = filter;
        if (search) params.search = search;
        const { data } = await axios.get(`${API}/events`, { params });
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filter, search, API]);

  return (
    <div className="page-container">
      <h1 className="page-title">Volunteer Events</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Search events or location..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 220 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}>
          <option value="">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="postponed">Postponed</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No events found.</p>
        </div>
      ) : (
        <div className="grid-3">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
}
