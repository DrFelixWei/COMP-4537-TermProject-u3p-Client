import React, { useEffect, useState } from 'react';
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
  Paper
} from '@mui/material';
import { useAuthHeader } from 'react-auth-kit';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch token from react-auth-kit
  const authHeader = useAuthHeader();  // This hook provides the Authorization header

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/getUsers`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader(),  // Automatically adds 'Bearer {token}' to the header
            'X-User-Role': 'admin',
          },
          credentials: 'include', // In case you also want to send cookies
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch users');
        }

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);  // Only run this effect once on mount

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" p={4}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!users || users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No users found.</TableCell>
                </TableRow>
              )}
              {users && users.length > 0 && users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Admin;
