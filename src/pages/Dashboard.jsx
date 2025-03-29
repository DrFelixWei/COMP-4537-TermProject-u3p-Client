// ChatGPT was used to aid in the creation of this code.

import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {styled} from "@mui/material/styles";
import Card from "../components/Card/Card.jsx";
import PDFUpload from "../components/PDFUpload/PDFUpload";
import {useAuthUser} from "react-auth-kit";
import APIUsage from "../components/API/apiUsage.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const StyledPaper = styled(Paper)(({theme}) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const StyledButton = styled(Button)(({theme}) => ({
  backgroundColor: "#4caf50",
  color: "white",
  "&:hover": {
    backgroundColor: "#388e3c",
  },
  "&.Mui-disabled": {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

const Dashboard = () => {
  const auth = useAuthUser();
  const user = auth();
  const userEmail = user?.email || "test@example.com";
  const userId = user?.id || 1;

  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [apiUsage, setAPIUsage] = useState(0);
  const MAX_USAGE = 20;
  
  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

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

  const handleFlashcardsGenerated = (newFlashcards, deckInfo) => {
    console.log("New flashcards generated:", newFlashcards);
    console.log("Deck info:", deckInfo);

    // Refresh the decks list
    fetchDecks();

    // Select the newly created deck
    if (deckInfo && deckInfo.deckId) {
      setSelectedDeckId(deckInfo.deckId);

      // Set the flashcards for this deck
      setFlashcards(newFlashcards);
      setCurrentCardIndex(0);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    if (selectedDeckId) {
      fetchFlashcardsByDeckId(selectedDeckId);
    } else if (decks.length > 0) {
      // Auto-select the first deck if available
      setSelectedDeckId(decks[0].id);
    }
  }, [selectedDeckId, decks]);

  const fetchDecks = async () => {
    try {
      console.log("Fetching decks for:", userEmail);
      const response = await fetch(
        `${backendUrl}/api/flashcards/decks/${userEmail}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch decks");
      }
      const data = await response.json();
      console.log("Fetched decks:", data);

      if (data.decks && data.decks.length > 0) {
        setDecks(data.decks);
        if (!selectedDeckId) {
          setSelectedDeckId(data.decks[0].id);
        }
      } else {
        setDecks([]);
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
      setDecks([]);
    }
  };

  const fetchFlashcardsByDeckId = async (deckId) => {
    try {
      console.log("Fetching flashcards for deck:", deckId);
      const response = await fetch(
        `${backendUrl}/api/flashcards/retrieve/${userEmail}?deckId=${deckId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }
      const data = await response.json();
      console.log("Fetched flashcards:", data);

      if (data.flashCardData && data.flashCardData.length > 0) {
        setFlashcards(data.flashCardData);
        setCurrentCardIndex(0);
      } else {
        setFlashcards([]);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setFlashcards([]);
    }
  };

  const handleDeckChange = (event) => {
    setSelectedDeckId(event.target.value);
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

  const handleDeleteDeck = async () => {
    try {
      console.log("Deleting currently selected deck with ID: ", selectedDeckId);
      const response = await fetch(`${backendUrl}/api/flashcards/delete/${selectedDeckId}/${userEmail}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok){
        throw new Error("Failed to delete deck");
      }
      console.log("Deck deleted successfully");
      setDecks((prevDecks) => prevDecks.filter(deck => deck.id !== selectedDeckId));
      setStatusMessage({ message: "Deck deleted successfully", type: "success" });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setStatusMessage({ message: "", type: "" });
      }, 3000);
    } catch (error){
      console.error("Error deleting deck: ", error.message);
      setStatusMessage({ message: `Error deleting deck: ${error.message}`, type: "error" });
    }
  };

  const handleEditClick = () => {
    const currentDeck = decks.find(deck => deck.id === selectedDeckId);
    if (currentDeck) {
      setNewDeckName(currentDeck.name);
      setEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveDeckName = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/flashcards/update/${selectedDeckId}/${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDeckName }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update deck name");
      }
      
      // Update the local deck list with the new name
      setDecks(prevDecks => 
        prevDecks.map(deck => 
          deck.id === selectedDeckId 
            ? { ...deck, name: newDeckName } 
            : deck
        )
      );
      
      setEditDialogOpen(false);
      setStatusMessage({ message: "Deck name updated successfully", type: "success" });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setStatusMessage({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating deck name:", error);
      setStatusMessage({ message: `Error updating deck name: ${error.message}`, type: "error" });
    }
  };

  // Get current flashcard data
  const currentFlashcard =
    flashcards.length > 0 ? flashcards[currentCardIndex] : null;

  // Find current deck name
  const currentDeckName =
    decks.find((deck) => deck.id === selectedDeckId)?.name || "Select a Deck";

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        py={4}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)"}}
        >
          Dashboard
        </Typography>

        {statusMessage.message && (
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              p: 2,
              backgroundColor: statusMessage.type === "success" ? "rgba(76, 175, 80, 0.3)" : "rgba(255, 0, 0, 0.3)",
              color: "white"
            }}
          >
            <Typography>{statusMessage.message}</Typography>
          </Paper>
        )}

        <APIUsage apiUsage={apiUsage} MAX_USAGE={MAX_USAGE}/>

        { apiUsage >= MAX_USAGE &&
        <StyledPaper elevation={3} sx={{width: "100%"}}>
          <Typography
            variant="h5"
            component="h2"  
            gutterBottom
            sx={{color: "white"}}
          >
            Upgrade Your Plan
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "rgba(255, 255, 255, 0.7)"}}
            paragraph
          >
            You have reached the maximum API usage limit. Please upgrade your plan to continue using the service.
          </Typography>
        </StyledPaper>
        }

        { apiUsage < MAX_USAGE &&  
        <StyledPaper elevation={3} sx={{width: "100%"}}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{color: "white"}}
          >
            Upload Study Material
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "rgba(255, 255, 255, 0.7)"}}
            paragraph
          >
            Upload your PDF to automatically generate flashcards using AI
          </Typography>
          <PDFUpload
            userEmail={userEmail}
            onFlashcardsGenerated={handleFlashcardsGenerated}
            darkMode={true}
          />
        </StyledPaper>
        }

        {decks.length > 0 && (
          <StyledPaper elevation={3} sx={{width: "100%"}}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{color: "white"}}
            >
              Your Flashcard Decks
            </Typography>
            <FormControl fullWidth sx={{mb: 3}}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <InputLabel id="deck-select-label" sx={{color: "white"}}>
                  Select Deck
                </InputLabel>
                <Select
                  labelId="deck-select-label"
                  id="deck-select"
                  value={selectedDeckId || ""}
                  label="Select Deck"
                  onChange={handleDeckChange}
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    ".MuiSvgIcon-root": {color: "white"},
                  }}
                >
                  {decks.map((deck) => (
                    <MenuItem
                      key={deck.id}
                      value={deck.id}
                      sx={{color: "black"}}
                    >
                      {deck.name}
                    </MenuItem>
                  ))}
                </Select>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={handleEditClick}
                    disabled={!selectedDeckId}
                    sx={{
                      color: "white",
                      "&:hover": {backgroundColor: "rgba(33, 150, 243, 0.1)"},
                      mr: 1
                    }}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={handleDeleteDeck}
                    disabled={!selectedDeckId}
                    sx={{
                      color: "white",
                      "&:hover": {backgroundColor: "rgba(255, 0, 0, 0.1)"},
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </FormControl>
          </StyledPaper>
        )}

        {currentFlashcard ? (
          <StyledPaper elevation={3} sx={{width: "100%"}}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{color: "white"}}
            >
              {currentDeckName}: Card {currentCardIndex + 1} of{" "}
              {flashcards.length}
            </Typography>
            <Divider
              sx={{mb: 3, backgroundColor: "rgba(255, 255, 255, 0.1)"}}
            />

            <Box display="flex" justifyContent="center" mb={3}>
              <Card
                faceBackgroundColor="#2c3e50" // Dark blue for question side
                backBackgroundColor="#1e824c" // Darker green for answer side
                length={336}
                width={240}
                value={{
                  front: currentFlashcard.question || currentFlashcard.term,
                  back: currentFlashcard.answer || currentFlashcard.definition,
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
          <StyledPaper
            elevation={3}
            sx={{width: "100%", textAlign: "center", py: 4}}
          >
            <Typography variant="h6" sx={{color: "white"}}>
              {decks.length > 0
                ? "No flashcards available in this deck. Upload a PDF to create some!"
                : "No flashcard decks available. Upload a PDF to create your first deck!"}
            </Typography>
          </StyledPaper>
        )}

        <StyledPaper elevation={3} sx={{width: "100%"}}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{color: "white"}}
          >
            Your Study Progress
          </Typography>
          {/* You can put study progress stats here */}
          <Typography variant="body1" sx={{color: "white"}}>
            Total Decks: {decks.length}
          </Typography>
          {selectedDeckId && (
            <Typography variant="body1" sx={{color: "white"}}>
              Cards in Current Deck: {flashcards.length}
            </Typography>
          )}
        </StyledPaper>
      </Box>

      {/* Edit Deck Name Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            color: "white",
            borderRadius: 2,
            minWidth: "350px"
          }
        }}
      >
        <DialogTitle>Edit Deck Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Deck Name"
            fullWidth
            variant="outlined"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            InputLabelProps={{
              sx: { color: "rgba(255, 255, 255, 0.7)" }
            }}
            InputProps={{
              sx: { 
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)"
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)"
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white"
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDeckName} 
            sx={{ 
              backgroundColor: "#4caf50", 
              color: "white",
              "&:hover": {
                backgroundColor: "#388e3c",
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;