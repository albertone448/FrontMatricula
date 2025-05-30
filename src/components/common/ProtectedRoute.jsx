import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
	const usuario = localStorage.getItem("usuario");

	// Si no está autenticado o no tiene datos de usuario, redirigir al login
	if (!isAuthenticated || !usuario) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;