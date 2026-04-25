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


}
