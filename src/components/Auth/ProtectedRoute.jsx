import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import { logout } from "../../redux/slices/authSlice";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Check token validity
    const checkTokenValidity = () => {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now();
        const expirationTime = decoded.exp * 1000;

        // If token is expired
        if (expirationTime < currentTime) {
          console.log("Token expired - logging out");
          dispatch(logout());
          setIsValid(false);
          return false;
        }

        return true;
      } catch (error) {
        console.log("Invalid token - logging out", error);
        dispatch(logout());
        setIsValid(false);
        return false;
      }
    };

    // Check immediately
    const isTokenValid = checkTokenValidity();
    if (!isTokenValid) return;

    // Set up interval to check every minute
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 60000); // Check every 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [token, dispatch]);

  // If no token or invalid token, redirect
  if (!token || !isValid) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;