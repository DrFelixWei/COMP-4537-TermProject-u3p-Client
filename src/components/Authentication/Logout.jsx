import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Logout = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
