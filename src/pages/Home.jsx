import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Login from '../components/Authentication/Login.jsx' 
import Signup from '../components/Authentication/Signup.jsx' 

const Home = () => {


  const [showSignup, setShowSignup] = useState(false);
  

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h3" component="h1">Home</Typography>

      { !showSignup && <Login/> }
      { showSignup && <Signup/> }

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        onClick={() => setShowSignup(!showSignup)}
      >
        { !showSignup && <Typography>Create New Account</Typography> }
        { showSignup && <Typography>Log Into Existing Account</Typography> }
      </Button>

    </Box>
  )
}

export default Home
