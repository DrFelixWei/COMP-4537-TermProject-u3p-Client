import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Logout from "../Authentication/Logout";
import Login from "../Authentication/Login"; // Import Login component
import { AppBar, Toolbar, Button, Box, Typography, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Close button for modal
import { useState } from "react";

const Navbar = () => {
  const auth = useAuthUser(); // Get user data
  const [open, setOpen] = useState(false); // State for login modal

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>

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
            <Button color="inherit" onClick={() => setOpen(true)}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Login Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Login />
      </Dialog>
    </>
  );
};

export default Navbar;
