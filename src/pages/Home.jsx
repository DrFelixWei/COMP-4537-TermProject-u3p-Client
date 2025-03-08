import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import LoginContainer from '../components/Authentication/LoginContainer.jsx'

const Home = () => {


  const [showSignup, setShowSignup] = useState(false);
  

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h3" component="h1">Home</Typography>

      <LoginContainer/>

    </Box>
  )
}

export default Home
