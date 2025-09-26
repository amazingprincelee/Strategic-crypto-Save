import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status on app startup
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return children;
};

export default AuthInitializer;