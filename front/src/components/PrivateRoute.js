import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token"); // Проверка наличия токена
    return (
        <Route
            element={isAuthenticated ? children : <Navigate to="/login" />}
        />
    );
};

export default PrivateRoute;