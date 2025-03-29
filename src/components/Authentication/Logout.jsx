import { useSignOut, useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Logout = () => {
  const { t } = useTranslation();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser();

  const handleLogout = async () => {
    try {
      const user = auth();

      // If the user is logged in with a test token, just sign out without API call
      if (user && user.token === "test-token") {
        signOut();
        navigate("/");
        return;
      }

      // Otherwise, call the actual logout API
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      {t('navbar.logout')}
    </Button>
  );
};

export default Logout;
