import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Card from "../components/Card/Card.jsx";
import PDFUpload from "../components/PDFUpload/PDFUpload";
import { useAuthUser } from 'react-auth-kit';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50', 
  color: 'white',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
}));

const Dashboard = () => {
  const auth = useAuthUser();
  const user = auth(); 
  const userEmail = user?.email || 'test@example.com';

  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleFlashcardsGenerated = (newFlashcards) => {
    setFlashcards(newFlashcards);
    setCurrentCardIndex(0);
  };

  useEffect(() => {
    if (flashcards.length === 0) {
      fetchFlashcards();
    }
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/flashcards/retrieve/${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      const data = await response.json();
      if (data.flashCardData && data.flashCardData.length > 0) {
        setFlashcards(data.flashCardData);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Get current flashcard data
  const currentFlashcard = flashcards.length > 0 ? flashcards[currentCardIndex] : null;

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" py={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Dashboard
        </Typography>
        
        <StyledPaper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
            Upload Study Material
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} paragraph>
            Upload your PDF to automatically generate flashcards using AI
          </Typography>
          <PDFUpload 
            userEmail={userEmail} 
            onFlashcardsGenerated={handleFlashcardsGenerated} 
            darkMode={true}
          />
        </StyledPaper>
        
        {currentFlashcard ? (
          <StyledPaper elevation={3} sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
              Flashcard {currentCardIndex + 1} of {flashcards.length}
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box display="flex" justifyContent="center" mb={3}>
              <Card
                faceBackgroundColor="#2c3e50" // Dark blue for question side
                backBackgroundColor="#1e824c" // Darker green for answer side
                length={336}
                width={240}
                value={{
                  front: currentFlashcard.question || currentFlashcard.term,
                  back: currentFlashcard.answer || currentFlashcard.definition
                }}
                flipTimer={10000} // Auto-flip after 10 seconds
              />
            </Box>
            
            <Box display="flex" justifyContent="space-between" mt={2}>
              <StyledButton 
                variant="contained"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
              >
                Previous
              </StyledButton>
              <StyledButton 
                variant="contained"
                onClick={handleNextCard}
                disabled={currentCardIndex === flashcards.length - 1}
              >
                Next
              </StyledButton>
            </Box>
          </StyledPaper>
        ) : (
          <StyledPaper elevation={3} sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              No flashcards available. Upload a PDF to create some!
            </Typography>
          </StyledPaper>
        )}
        
        <StyledPaper elevation={3} sx={{ width: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
            Your Study Progress
          </Typography>
          {/* You can put study progress stats here */}
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Dashboard;
