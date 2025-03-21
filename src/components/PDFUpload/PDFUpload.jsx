// ChatGPT was used to aid in the creation of this code.

import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress, Alert, AlertTitle } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const PDFUpload = ({ userEmail, onFlashcardsGenerated, darkMode = false }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError({
        message: 'Please select a valid PDF file',
        step: 'validation',
        status: 400
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('email', userEmail);
    
    // The filename will be used as the deck name on the server

    setIsLoading(true);
    setError(null);
    setProgress('Uploading PDF...');

    try {
      console.log("Backend URL:", backendUrl);
      const response = await fetch(`${backendUrl}/api/flashcards/create`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw {
          message: data.error || 'Failed to process flashcards',
          step: data.step || 'unknown',
          status: response.status
        };
      }
      
      setProgress('Flashcards created successfully!');
      console.log("Flashcards created:", data);
      
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(data.flashCards, {
          deckId: data.deckId,
          deckName: data.deckName
        });
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
      
      // Handle both structured API errors and network/parsing errors
      setError({
        message: err.message || 'Failed to generate flashcards',
        step: err.step || 'unknown',
        status: err.status || 500
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error step descriptions
  const getErrorStepDescription = (step) => {
    const descriptions = {
      'validation': 'Input validation',
      'pdf_extraction': 'PDF text extraction',
      'ai_generation': 'AI processing',
      'user_verification': 'User account verification',
      'database': 'Database storage',
      'unknown': 'Unknown step'
    };
    
    return descriptions[step] || 'Processing';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'primary.main',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'primary.dark',
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="pdf-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadFileIcon />}
            sx={{
              backgroundColor: darkMode ? '#4caf50' : 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: darkMode ? '#388e3c' : 'primary.dark',
              }
            }}
          >
            Select PDF
          </Button>
        </label>
        
        {selectedFile && (
          <Typography variant="body1" sx={{ mt: 2, color: darkMode ? 'white' : 'text.primary' }}>
            Selected file: {selectedFile.name}
          </Typography>
        )}
        
        {selectedFile && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isLoading}
            sx={{
              mt: 2,
              backgroundColor: darkMode ? '#4caf50' : 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: darkMode ? '#388e3c' : 'primary.dark',
              }
            }}
          >
            Generate Flashcards
          </Button>
        )}
      </Box>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress sx={{ 
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : undefined,
            '& .MuiLinearProgress-bar': {
              backgroundColor: darkMode ? '#4caf50' : undefined
            }
          }} />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: darkMode ? 'rgba(255, 255, 255, 0.7)' : undefined }}>
            {progress}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            backgroundColor: darkMode ? 'rgba(211, 47, 47, 0.15)' : undefined,
            color: darkMode ? '#ff8a80' : undefined,
            border: darkMode ? '1px solid rgba(211, 47, 47, 0.3)' : undefined
          }}
        >
          <AlertTitle>Error during {getErrorStepDescription(error.step)}</AlertTitle>
          {error.message}
        </Alert>
      )}
    </Box>
  );
};

export default PDFUpload;