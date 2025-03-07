import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Card from '../components/Card/Card.jsx'


const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h3" component="h1">Home</Typography>

      <Card/>
    </Box>
  )
}

export default Home
