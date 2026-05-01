import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = 'http://localhost:5001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vh_token'));
  const [loading, setLoading] = useState(true);

  // Attach token to every axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('vh_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('vh_token');
    }
  }, [token]);

  // Fetch current user on load
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get(`${API}/auth/me`);
        setUser(data);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}