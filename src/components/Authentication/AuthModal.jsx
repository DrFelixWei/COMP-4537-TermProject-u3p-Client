import React, { useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogContent, IconButton, TextField, Button, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from 'react-i18next';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AuthModal = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", confirmEmail: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (showSignup) {
      const { name, email, confirmEmail, password } = formData;
      if (!name || !email || !confirmEmail || !password) {
        setError(t('authModal.allFieldsRequired'));
        return;
      }
      if (email !== confirmEmail) {
        setError(t('authModal.emailsDoNotMatch'));
        return;
      }
    }

    try {
      const endpoint = showSignup ? "/api/users/register" : "/api/users/login";
      const body = showSignup ? 
        { name: formData.name, email: formData.email, password: formData.password } 
        : 
        { email: formData.email, password: formData.password };
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('authModal.authenticationFailed')); 

      signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role },
      });

      navigate("/dashboard");
      setIsOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm"
      PaperProps={{ 
        sx: { backgroundColor: theme.palette.background.secondary, color: theme.palette.text.primary } 
        }}>
      
      <IconButton onClick={() => setIsOpen(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent>

        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          
          <Typography variant="h5" gutterBottom>
            {showSignup ? t('authModal.signUp') : t('authModal.login')}
          </Typography>

          {error && 
            <Alert severity="error">
              {error}
            </Alert>
          }

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {showSignup && <TextField label={t('authModal.fullName')} name="name" value={formData.name} onChange={handleChange} required />}
            
            <TextField label={t('authModal.email')} type="email" name="email" value={formData.email} onChange={handleChange} required />
            
            {showSignup && <TextField label={t('authModal.confirmEmail')} type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />}
            
            <TextField label={t('authModal.password')} type="password" name="password" value={formData.password} onChange={handleChange} required />
            
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {showSignup ? t('authModal.signUp') : t('authModal.login')}
            </Button>

          </Box>

          <Typography 
            sx={{ mt: 2, cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
            onClick={() => setShowSignup(!showSignup)}
          >
            {showSignup ? t('authModal.returningUser') : t('authModal.newUser')}
          </Typography>

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
