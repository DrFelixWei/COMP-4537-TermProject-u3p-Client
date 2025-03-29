// ChatGPT was used to aid in the creation of this code.

import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress, Alert, AlertTitle } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const PDFUpload = ({ userEmail, onFlashcardsGenerated, darkMode = false }) => {
  const { t } = useTranslation();
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
        message: t('pdfUpload.errorInvalidFile'),
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
    
    setIsLoading(true);
    setError(null);
    setProgress(t('pdfUpload.uploading'));

    try {
      const response = await fetch(`${backendUrl}/api/v1/flashcards/create`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw {
          message: data.error || t('pdfUpload.errorProcessing'),
          step: data.step || 'unknown',
          status: response.status
        };
      }
      
      setProgress(t('pdfUpload.success'));
      
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(data.flashCards, {
          deckId: data.deckId,
          deckName: data.deckName
        });
      }
    } catch (err) {
      setError({
        message: err.message || t('pdfUpload.errorGenerate'),
        step: err.step || 'unknown',
        status: err.status || 500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorStepDescription = (step) => {
    const descriptions = {
      'validation': t('pdfUpload.validationStep'),
      'pdf_extraction': t('pdfUpload.pdfExtractionStep'),
      'ai_generation': t('pdfUpload.aiGenerationStep'),
      'user_verification': t('pdfUpload.userVerificationStep'),
      'database': t('pdfUpload.databaseStep'),
      'unknown': t('pdfUpload.unknownStep')
    };
    
    return descriptions[step] || t('pdfUpload.processingStep');
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
            {t('pdfUpload.selectPdf')}
          </Button>
        </label>
        
        {selectedFile && (
          <Typography variant="body1" sx={{ mt: 2, color: darkMode ? 'white' : 'text.primary' }}>
            {t('pdfUpload.selectedFile', { filename: selectedFile.name })}
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
            {t('pdfUpload.generateFlashcards')}
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
          <AlertTitle>{t('pdfUpload.errorTitle', { step: getErrorStepDescription(error.step) })}</AlertTitle>
          {error.message}
        </Alert>
      )}
    </Box>
  );
};

export default PDFUpload;