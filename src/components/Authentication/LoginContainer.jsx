import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Login from './Login.jsx' 
import Signup from './Signup.jsx' 

const LoginContainer = () => {

  const [showSignup, setShowSignup] = useState(false);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
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

export default LoginContainer
