import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import beesImg from '../assets/bees.png';
import photo1 from '../assets/photo1.png';
import photo2 from '../assets/photo2.png';
import photo3 from '../assets/photo3.png';

export default function Landing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>

      {/* Top nav bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--primary-border)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={beesImg} alt="VolunteerHive" style={{ height: 28, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>VolunteerHive</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline btn-sm">👤 {user.firstName}</Link>
              <button className="btn btn-primary btn-sm" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <header style={{ background: 'var(--primary-light)', padding: '32px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#4b3a7a', marginBottom: 4 }}>Welcome to</h2>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-1px', marginBottom: 12 }}>
          VolunteerHive
        </h1>
        <p style={{ fontSize: '1rem', color: '#4b3a7a', maxWidth: 500, margin: '0 auto 20px' }}>
          Sign in to view volunteer opportunities for the Career Center at Sac State today!
        </p>
        <Link to="/events" className="btn btn-primary" style={{ fontSize: '1rem' }}>
          View Events
        </Link>
      </header>

      {/* Photos */}
      <section style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 36 }}>
          {[photo1, photo2, photo3].map((src, i) => (
            <img key={i} src={src} alt={`Volunteer photo ${i + 1}`} style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              objectPosition: i === 1 ? 'center 20%' : 'center',
              borderRadius: 16,
              display: 'block',
            }} />
          ))}
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
            Our goal is to create an environment that simplifies the process for students and staff alike.
            We wish to create a portal allowing these parties to post or sign up for upcoming career fairs
            and similar events. This also allows students to make connections and build their professional network.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--primary-bg)', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 28 }}>
            What VolunteerHive Offers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '📋', title: 'Browse Events', desc: 'View upcoming volunteer opportunities with full details.' },
              { icon: '✅', title: 'Easy Sign Up', desc: 'Register and cancel events with one click.' },
              { icon: '👤', title: 'Your Profile', desc: 'Manage your account, major, and contact info.' },
              { icon: '🔒', title: 'Secure Access', desc: 'Login with your Sac State email securely.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--primary-dark)' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--primary-dark)', color: 'white', textAlign: 'center', padding: '20px' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
          © 2026 VolunteerHive — Busy Bees | Sacramento State Career Center
        </p>
      </footer>
    </div>
  );
}
