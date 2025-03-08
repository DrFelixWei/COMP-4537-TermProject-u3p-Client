import React from 'react'
import { CssBaseline, Box } from '@mui/material'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home' 
import Admin from './pages/Admin' 
import Dashboard from './pages/Dashboard' 
import NavBar from './components/Navbar/Navbar.jsx'
import ProtectedRoute from "./components/Authentication/ProtectedRoute.jsx";


const theme = createTheme({
  palette: {
    background: {
      default: '#0c2830',  // Deep teal
      primary: '#174a5c',  // Darker blue-teal for sections
      secondary: '#122b36',  // Even darker teal for contrast
    },
    text: {
      primary: '#F5F5F5',  // White for readability
      secondary: '#A3C1C7',  // Muted cyan for soft contrast
    },
    primary: {
      main: '#38A3A5',  // Soft cyan-green for highlights
    },
    secondary: {
      main: '#E85D04',  // Warm orange for accents
    },
    accent: {
      main: '#F2C14E',  // Golden yellow for highlights
    },
  },
});


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

            <NavBar/>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><Admin/></ProtectedRoute>}/>
            </Routes>
            
          </Content>
        </Root>
      </Router>
    </ThemeProvider>
  )
}

export default App
