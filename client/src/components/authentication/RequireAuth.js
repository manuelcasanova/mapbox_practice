import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode'; // Correct import statement

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    let decoded = null;
    try {
        decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
    }

    return (
        auth?.accessToken
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
