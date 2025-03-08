import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthModal = ({ isOpen, setIsOpen }) => {
  const theme = useTheme();
  const [showSignup, setShowSignup] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.secondary,
          color: theme.palette.text.primary,
        },
      }}
    >
      <IconButton onClick={() => setIsOpen(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          {!showSignup ? <Login onSubmit={() => setIsOpen(false)} /> : <Signup onSubmit={() => setIsOpen(false)} />}
          <Typography
            sx={{ mt: 2, cursor: "pointer", color: "primary.main", textDecoration: "underline" }}
            onClick={() => setShowSignup(!showSignup)}
          >
            {!showSignup ? "New? Create A New Account" : "Returning? Log Into Your Existing Account"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const Login = ({ onSubmit }) => {
  const theme = useTheme();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { id: data.user.id, name: data.user.name, role: data.user.role },
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
    if (onSubmit) onSubmit();
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5, backgroundColor: theme.palette.background.primary, color: theme.palette.text.primary }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const Signup = ({ onSubmit }) => {
  const theme = useTheme();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", confirmEmail: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, confirmEmail, password } = formData;
    if (!name || !email || !confirmEmail || !password) return setError("All fields are required.");
    if (email !== confirmEmail) return setError("Emails do not match.");
    try {
      const response = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { id: data.user.id, name: data.user.name, role: data.user.role },
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
    if (onSubmit) onSubmit();
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5, backgroundColor: theme.palette.background.primary, color: theme.palette.text.primary }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSignup} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Confirm Email" type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
          <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthModal;
