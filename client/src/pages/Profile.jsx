import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../conext/AuthContext';

export default function Profile() {
    const { user, updateUser, API } = useAuth();
    const [form, setForm] = useState({
        firstName: user.firstName || '', lastName: user.lastName || '',
        displayName: user.displayName || '', graduationYear: user.graduationYear || '',
        major: user.major || '', skills: user.skills || '', contactInfo: user.contactInfo || ''
    });

    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pwMessage, setPwMessage] = useState('');
    const [pwError, setPwError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [tab, setTab] = useState('profile');

    const handleProfileChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        try {
            const { data } = await axios.put(`${API}/users/profile`, form);
            updateUser(data);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwError(''); setPwMessage('');
        if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Passwords do not match');
        setPwLoading(true);
        try {
            await axios.put(`${API}/users/change-password`, {
                currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword,
            });
            setPwMessage('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.message || 'Password change failed');
        } finally {
            setPwLoading(false);
        }
    };

    const tabStyle = (t) => ({
        padding: '8px 20px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9rem',
        cursor: 'pointer', border: 'none', transition: 'all 0.2s',
        background: tab === t ? 'var(--primary)' : 'transparent',
        color: tab === t ? 'white' : 'var(--text-muted)',
    });

    return (
        <div className="page-container" style={{ maxWidth: 680 }}>
            <h1 className="page-title">My Profile</h1>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', color: 'white', fontWeight: 800, flexShrink: 0,
                }}>
                    {user.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                    <h2 style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                        {user.displayName || `${user.firstName} ${user.lastName}`}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                    <span className={`badge-pill ${user.role === 'admin' ? 'badge-registered' : 'badge-upcoming'}`} style={{ marginTop: 6, display: 'inline-block' }}>
                        {user.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--white)', padding: '6px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', width: 'fit-content' }}>
                <button style={tabStyle('profile')} onClick={() => setTab('profile')}>Edit Profile</button>
                <button style={tabStyle('password')} onClick={() => setTab('password')}>Change Password</button>
            </div>


            {tab === 'profile' && (
                <div className="card">
                    {error && <div className="alert alert-error">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}
                    <form onSubmit={handleProfileSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input name="firstName" value={form.firstName} onChange={handleProfileChange} required />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input name="lastName" value={form.lastName} onChange={handleProfileChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Display Name (optional)</label>
                            <input name="displayName" value={form.displayName} onChange={handleProfileChange} placeholder="How your name appears to others" />
                        </div>
                        {user.role === 'student' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                    <div className="form-group">
                                        <label>Graduation Year</label>
                                        <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleProfileChange} min="2024" max="2030" />
                                    </div>
                                    <div className="form-group">
                                        <label>Major</label>
                                        <input name="major" value={form.major} onChange={handleProfileChange} placeholder="e.g. Computer Science" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Skills</label>
                                    <input name="skills" value={form.skills} onChange={handleProfileChange} placeholder="e.g. Communication, Leadership" />
                                </div>
                                <div className="form-group">
                                    <label>Contact Info</label>
                                    <input name="contactInfo" value={form.contactInfo} onChange={handleProfileChange} placeholder="Phone or alternate email" />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {tab === 'password' && (
                <div className="card">
                    {pwError && <div className="alert alert-error">{pwError}</div>}
                    {pwMessage && <div className="alert alert-success">{pwMessage}</div>}
                    <form onSubmit={handlePwSave}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={pwLoading}>
                            {pwLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}



