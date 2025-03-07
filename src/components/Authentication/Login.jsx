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
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
  };

  const handleTestLogin = (role) => {
    const testUser = {
      id: role === "admin" ? 1 : 2,
      name: role === "admin" ? "Admin User" : "Test User",
      role: role,
    };

    signIn({
      token: "test-token",
      expiresIn: 3600,
      tokenType: "Bearer",
      authState: testUser,
    });

    if (role === "admin") {
      navigate("/admin");

    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
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

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => handleTestLogin("user")}
      >
        TEST USER LOGIN
      </Button>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => handleTestLogin("admin")}
      >
        TEST ADMIN LOGIN
      </Button>
    </Container>
  );
};

export default Login;
