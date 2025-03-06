import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Logout = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Send request to clear cookie on the server
      });

      signOut(); // Remove auth state from react-auth-kit
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
