import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import beesImg from '../assets/bees.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => pathname.startsWith(path);

  const navLinkStyle = (path) => ({
    padding: '6px 14px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9rem',
    color: isActive(path) ? 'var(--white)' : 'var(--primary-dark)',
    background: isActive(path) ? 'var(--primary)' : 'transparent',
    transition: 'all 0.2s', textDecoration: 'none',
  });

  return (
    <nav style={{
      background: 'var(--white)', borderBottom: '2px solid var(--primary-light)',
      padding: '0 20px', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(155,127,212,0.1)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src={beesImg} alt="VolunteerHive" style={{ height: 32, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-dark)' }}>VolunteerHive</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <Link to="/profile" style={navLinkStyle('/profile')}>👤 {user.firstName}</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ marginLeft: 4 }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle('/login')}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
