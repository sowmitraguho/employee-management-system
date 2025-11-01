import React, { useContext  } from 'react';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Spinner from '../../Components/Spinner/Spinner'

const PrivateRoute = ({ children }) => {

   const { loggedInUser, loading } = useContext(AuthContext);
   //const [role, setRole] = useState(null);
   const location = useLocation();

   if (loading) {
      return <Spinner />
   }

   if (!loggedInUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }


   return children;
};

export default PrivateRoute;