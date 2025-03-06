import React, { useState } from 'react'
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material'
// import { styled } from '@mui/material/styles'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Save token & user data in a cookie
      signIn({
        token: data.token, // Token received from the API
        expiresIn: 3600, // 1 hour expiration
        tokenType: "Bearer", // Usually "Bearer"
        authState: { id: data.user.id, name: data.user.name, role: data.user.role }, // Save user info
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
