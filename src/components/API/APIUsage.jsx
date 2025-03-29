// ChatGPT was used to aid in the creation of this code.

import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const UsageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const UsageBarWrapper = styled(Box)({
  position: 'relative',
  flex: 1,
});

const UsageBar = styled(LinearProgress)(({ theme }) => ({
  height: 30,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
  },
}));

const UsageText = styled(Typography)({
  position: 'absolute',
  width: '100%',
  textAlign: 'center',
  top: '50%',
  transform: 'translateY(-50%)',
  fontWeight: 'bold',
  color: 'white',
});

const APIUsage = ({ 
  apiUsage = 0,
  MAX_USAGE = 20,
 }) => {
  
  const { t } = useTranslation();
  const usagePercentage = (apiUsage / MAX_USAGE) * 100;
  const usageColor = usagePercentage >= 100 ? 'error' : usagePercentage >= 75 ? 'warning' : 'primary';

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" p={2}>
      <UsageContainer>
        <Typography variant="h6">{t('API Usage')}</Typography>
        <UsageBarWrapper>
          <UsageBar 
            variant="determinate" 
            value={Math.min(usagePercentage, 100)} 
            color={usageColor} 
          />
          <UsageText variant="body1">
            {apiUsage} / {MAX_USAGE}
          </UsageText>
        </UsageBarWrapper>
      </UsageContainer>
    </Box>
  );
};

export default APIUsage;
