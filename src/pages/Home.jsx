import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" p={2}>
      <Typography variant="h3" component="h1">{t('home')}</Typography>

      <Box mt={2}>
        <img src="/logo.png" alt="Logo" width={400} height="auto" />
      </Box>


    </Box>
  )
}

export default Home
