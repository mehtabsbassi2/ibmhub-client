// components/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthUser } from '../redux/userSlice';
import { LOGIN_PAGE } from './Routes';

const ProtectedRoutes = ({ children }) => {
  const user = useSelector(getAuthUser);

  if (!user) {
    return <Navigate to={LOGIN_PAGE} replace />;
  }

  return children;
};

export default ProtectedRoutes;
