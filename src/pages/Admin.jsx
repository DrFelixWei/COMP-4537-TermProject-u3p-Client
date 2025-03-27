import React, {useEffect, useState} from "react";
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
} from "@mui/material";
import {useAuthHeader} from "react-auth-kit";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [apiStats, setApiStats] = useState({
    userStats: [],
    aggregateStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch token from react-auth-kit
  const authHeader = useAuthHeader(); // This hook provides the Authorization header

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/getUsers`, {
        method: "GET",
        headers: {
          Authorization: authHeader(), // Automatically adds 'Bearer {token}' to the header
          "X-User-Role": "admin",
        },
        credentials: "include", // In case you also want to send cookies
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      // Ensure that data is always an array
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiStatistics = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/getApiStats`, {
        method: "GET",
        headers: {
          Authorization: authHeader(),
          "X-User-Role": "admin",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch API stats");
      }
      
      // Ensure we have the expected structure
      setApiStats({
        userStats: Array.isArray(data.userStats) ? data.userStats : [],
        aggregateStats: Array.isArray(data.aggregateStats) ? data.aggregateStats : []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchApiStatistics()]);
      setLoading(false);
    };
    
    fetchData();
  }, []); // Only run this effect once on mount

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

      {!loading && !error && (
        <Paper sx={{width: "100%", overflowX: "auto", mt: 2, p: 2, backgroundColor: 'transparent', boxShadow: 'none' }}>
          {/* Users Table */}
          <Paper sx={{mb: 3, p: 2, fontWeight: "bold", color: "black"}} elevation={3}>
            <Typography variant="h6"gutterBottom>
              Users
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
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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
    </Box>
  );
};

export default Admin;