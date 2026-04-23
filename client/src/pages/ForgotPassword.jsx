import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
    const { API } = useAuth();
    
}