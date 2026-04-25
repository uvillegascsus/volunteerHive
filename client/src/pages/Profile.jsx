import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../conext/AuthContext';

export default function Profile(){
    const { user, updateUser, API } = useAuth();
}
