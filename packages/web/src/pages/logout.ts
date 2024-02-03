import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_PERSON_EMAIL,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants/local-storage';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_PERSON_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    navigate('/');
  }, [navigate]);

  return null;
}

export default Logout;
