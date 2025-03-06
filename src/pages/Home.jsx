import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const LinkList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(4),
}))

const PageLink = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  margin: theme.spacing(2),
  fontSize: '1.5rem',
  '&:hover': {
    textDecoration: 'underline',
  },
}))

const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography variant="h3" component="h1">Home</Typography>

      <LinkList>
        {/* <PageLink href="/" target="_blank">Home</PageLink> */}
        
        <PageLink href="/card" >Card</PageLink>
        
      </LinkList>
    </Box>
  )
}

export default Home
