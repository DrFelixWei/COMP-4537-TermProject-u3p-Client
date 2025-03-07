import React from 'react'
import { CssBaseline, Box } from '@mui/material'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home' 
import Admin from './pages/Admin' 
import ProtectedRoute from "./components/Authentication/ProtectedRoute.jsx";
import Login from './components/Authentication/Login.jsx' 
import Signup from './components/Authentication/Signup.jsx' 

const theme = createTheme({
  palette: {
    background: {
      default: '#0c2830',
    },
    text: {
      primary: '#F5F5F5',
    },
  },
})

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  position: 'relative',
  width: '100vw',
  maxWidth: '100vw', // Ensures full width
  overflow: 'hidden',
}))

const Content = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'center',
  flex: 1,
  padding: theme.spacing(3),
}))

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Root>
          <Content>
            <Routes>
              
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />



              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />


            </Routes>
          </Content>
        </Root>
      </Router>
    </ThemeProvider>
  )
}

export default App
