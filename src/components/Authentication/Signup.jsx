import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, confirmEmail, password } = formData;

    if (!name || !email || !confirmEmail || !password) {
      setError("All fields are required.");
      return;
    }

    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

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
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
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

export default Signup;
