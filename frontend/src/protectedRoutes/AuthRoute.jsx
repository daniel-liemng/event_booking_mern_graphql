import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  if (token) {
    return <Navigate to='/events' />;
  }
  return children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;
