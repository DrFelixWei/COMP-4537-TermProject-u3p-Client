import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const MAX_USAGE = 20;

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
    backgroundColor: theme.palette.primary.main,
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

const APIUsage = ({ userId }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const [apiUsage, setAPIUsage] = useState(0);

  const fetchAPIUsage = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/users/getApiUsage/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user's API usage");
      }
      const data = await response.json();
      if (data.apiUsage) {
        setAPIUsage(data.apiUsage);
      }
    } catch (error) {
      console.error("Error fetching user's API usage:", error);
    }
  };

  useEffect(() => {
    fetchAPIUsage();
  }, []);

  const usagePercentage = (apiUsage / MAX_USAGE) * 100;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" p={2}>
      <UsageContainer>
        <Typography variant="h6">API Usage</Typography>
        <UsageBarWrapper>
          <UsageBar variant="determinate" value={Math.min(usagePercentage, 100)} />
          <UsageText variant="body1">
            {apiUsage} / {MAX_USAGE}
          </UsageText>
        </UsageBarWrapper>
      </UsageContainer>
    </Box>
  );
};

export default APIUsage;
