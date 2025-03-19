import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Logout from "../Authentication/Logout";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import AuthModal from "../Authentication/AuthModal";

const Navbar = () => {
  const auth = useAuthUser(); // Get user data
  const [loginOpen, setLoginOpen] = useState(false); 

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MemoMaker
          </Typography>

          {auth() ? (
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          ) : (
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
          )}

          {auth() ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              {auth().role === "admin" && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Panel
                </Button>
              )}
              <Logout />
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setLoginOpen(true)}>
              Login
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
