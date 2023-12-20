import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_TOKEN } from '../constants/local-storage';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage.removeItem(LOCAL_STORAGE_PERSON_HASH);
    // localStorage.removeItem(LOCAL_STORAGE_PERSON_NAME);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    navigate('/');
  }, [navigate]);

  return null;
}

export default Logout;
