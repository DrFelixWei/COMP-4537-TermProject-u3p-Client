// ChatGPT was used to aid in the creation of this code.

import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Logout from "../Authentication/Logout";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import AuthModal from "../Authentication/AuthModal";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useAuthUser(); // Get user data
  const [loginOpen, setLoginOpen] = useState(false); 

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('navbar.appName')}
          </Typography>

          {auth() ? (
          <Button color="inherit" component={Link} to="/dashboard">
            {t('navbar.dashboard')}
          </Button>
          ) : (
            <Button color="inherit" component={Link} to="/">
              {t('navbar.home')}
            </Button>
          )}

          {auth() ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              {auth().role === "admin" && (
                <Button color="inherit" component={Link} to="/admin">
                  {t('navbar.admin')}
                </Button>
              )}
              <Logout />
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setLoginOpen(true)}>
              {t('navbar.login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthModal
        isOpen={loginOpen} 
        setIsOpen={setLoginOpen}
      />


    </>
  );
};

export default Navbar;
