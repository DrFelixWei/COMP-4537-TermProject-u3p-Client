import React from 'react'
import { Box, Typography } from '@mui/material'
// import { styled } from '@mui/material/styles'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h3" component="h1">Admin</Typography>

      {/* A table to view and edit user accounts */}
      <Typography variant="h3" component="h1">{backendUrl}</Typography>

    </Box>
  )
}

export default Admin