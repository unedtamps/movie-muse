import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
    // Redirect to root route immediately
    navigate("/", { replace: true });
  }, [location.pathname, navigate]);

  // Return null or a minimal loading state while redirecting
  return null;
};

export default NotFound;
