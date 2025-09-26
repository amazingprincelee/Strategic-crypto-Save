import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Migrate from old authToken to new token key
    const oldToken = localStorage.getItem('authToken');
    const newToken = localStorage.getItem('token');
    
    if (oldToken && !newToken) {
      localStorage.setItem('token', oldToken);
      localStorage.removeItem('authToken');
    }
    
    // Check authentication status on app startup
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

export default AuthInitializer;