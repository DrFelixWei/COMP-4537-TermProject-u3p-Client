import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useAuthHeader } from "react-auth-kit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [apiStats, setApiStats] = useState({
    userStats: [],
    aggregateStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "user"
  });
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

  // Fetch token from react-auth-kit
  const authHeader = useAuthHeader(); 
  
  // Common headers for all requests
  const getHeaders = () => ({
    Authorization: authHeader(),
    "X-User-Role": "admin",
    "Content-Type": "application/json"
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/getUsers`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error fetching users: ${err.message}`);
      console.error("Error fetching users:", err);
    }
  };

  // Fetch a specific user by ID
  const fetchUserById = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/admin/getUser/${userId}`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }

      setSelectedUser(data);
      setUserFormData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "user"
      });
      
      setOpenEditDialog(true);
    } catch (err) {
      setError(`Error fetching user: ${err.message}`);
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/admin/updateUser/${selectedUser.id}`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(userFormData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      // Update the users list
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...userFormData } : user));
      setOpenEditDialog(false);
      setStatusMessage({ message: "User updated successfully", type: "success" });
      
      // Refresh user list
      fetchUsers();
    } catch (err) {
      setError(`Error updating user: ${err.message}`);
      console.error("Error updating user:", err);
      setStatusMessage({ message: `Error updating user: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/admin/deleteUser/${selectedUser.id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      // Remove user from the list
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setOpenDeleteDialog(false);
      setStatusMessage({ message: "User deleted successfully", type: "success" });
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
      console.error("Error deleting user:", err);
      setStatusMessage({ message: `Error deleting user: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch API statistics
  const fetchApiStatistics = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/getApiStats`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch API stats");
      }
      
      setApiStats({
        userStats: Array.isArray(data.userStats) ? data.userStats : [],
        aggregateStats: Array.isArray(data.aggregateStats) ? data.aggregateStats : []
      });
    } catch (err) {
      setError(`Error fetching API stats: ${err.message}`);
      console.error("Error fetching API stats:", err);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle opening edit dialog
  const handleEditUser = (user) => {
    fetchUserById(user.id);
  };

  // Handle opening delete dialog
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([fetchUsers(), fetchApiStatistics()]);
      } catch (err) {
        setError(`Error initializing admin panel: ${err.message}`);
        console.error("Error initializing admin panel:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (statusMessage.message && statusMessage.type === "success") {
      const timer = setTimeout(() => {
        setStatusMessage({ message: "", type: "" });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      p={4}
    >
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {statusMessage.message && (
        <Alert severity={statusMessage.type} sx={{ width: "100%", mb: 2 }}>
          {statusMessage.message}
        </Alert>
      )}

      {!loading && !error && (
        <Paper sx={{width: "100%", overflowX: "auto", mt: 2, p: 2, backgroundColor: 'transparent', boxShadow: 'none' }}>
          {/* Users Table */}
          <Paper sx={{mb: 3, p: 2, fontWeight: "bold", color: "black"}} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Users Management
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    ID
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Name
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Email
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Role
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{color: "black"}}>{user.id}</TableCell>
                      <TableCell sx={{color: "black"}}>{user.name}</TableCell>
                      <TableCell sx={{color: "black"}}>{user.email}</TableCell>
                      <TableCell sx={{color: "black"}}>{user.role}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditUser(user)}
                          aria-label="edit user"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteUser(user)}
                          aria-label="delete user"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* User Stats Table */}
          <Paper sx={{mb: 3, p: 2, fontWeight: "bold", color: "black"}} elevation={3}>
            <Typography variant="h6" gutterBottom>
              User Statistics
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Name
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Email
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Total Requests
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {apiStats.userStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No user stats found.
                    </TableCell>
                  </TableRow>
                ) : (
                  apiStats.userStats.map((userStats) => (
                    <TableRow key={userStats.email}>
                      <TableCell sx={{color: "black"}}>
                        {userStats.name}
                      </TableCell>
                      <TableCell sx={{color: "black"}}>
                        {userStats.email}
                      </TableCell>
                      <TableCell sx={{color: "black"}}>
                        {userStats.total_requests}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* API Stats Table */}
          <Paper sx={{mb: 3, p: 2, fontWeight: "bold", color: "black"}} elevation={3}>
            <Typography variant="h6" gutterBottom>
              API Usage Statistics
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    API Endpoint
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Method
                  </TableCell>
                  <TableCell sx={{fontWeight: "bold", color: "black"}}>
                    Requests
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {apiStats.aggregateStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No usage stats found.
                    </TableCell>
                  </TableRow>
                ) : (
                  apiStats.aggregateStats.map((aggregateStats) => (
                    <TableRow key={`${aggregateStats.api_endpoint}-${aggregateStats.method}`}>
                      <TableCell sx={{color: "black"}}>
                        {aggregateStats.api_endpoint}
                      </TableCell>
                      <TableCell sx={{color: "black"}}>
                        {aggregateStats.method}
                      </TableCell>
                      <TableCell sx={{color: "black"}}>
                        {aggregateStats.requests}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      )}

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={userFormData.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={userFormData.email}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={userFormData.role}
                label="Role"
                onChange={handleInputChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={updateUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "black" }}>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={deleteUser} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Admin;