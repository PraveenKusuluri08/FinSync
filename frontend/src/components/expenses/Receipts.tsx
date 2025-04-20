import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { receipts_data } from '../../store/middleware/middleware';
import { toast } from 'react-toastify';
import AXIOS_INSTANCE from '../../api/axios_instance';
import { Link } from 'react-router-dom';

const Receipts = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(receipts_data());
  }, [dispatch]);

  const receiptsData = useSelector((state: any) => state.receipts.receipts.data);

  const handleDeleteReceipt = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this receipt?");
    if (!confirmDelete) return;

    try {
      await AXIOS_INSTANCE.delete(`/deletereceipt/${id}`);
      toast.success("Receipt deleted successfully.");
      dispatch(receipts_data());
    } catch (error) {
      toast.error("Failed to delete receipt.");
      console.error("Delete error:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Receipts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Receipt ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receiptsData?.length > 0 ? (
              receiptsData.map((receipt: any, index: number) => (
                <TableRow key={receipt._id}>
                  <TableCell>
                    <Link to={`/receipts/${receipt._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {index+1}
                    </Link>
                    </TableCell>
                  <TableCell>{receipt.receipt_name}</TableCell>
                  <TableCell>{receipt.receipt_description}</TableCell>
                  <TableCell>
                    {new Date(receipt.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteReceipt(receipt._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="gray">No receipts available.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Receipts;
