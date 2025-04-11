/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { split_summary } from '../../store/middleware/middleware';
import AXIOS_INSTANCE from '../../api/axios_instance';
import { toast } from 'react-toastify';

// Utility: get initials from email
const getInitials = (email: string) => {
  const name = email.split('@')[0];
  return name
    .split(/[._]/)
    .map(part => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
};

// Utility: generate color
const getRandomColor = (seed: string) => {
  const colors = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0', '#795548'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ExpenseScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(split_summary());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const split_summary_request_data = useSelector((state: any) => state.split_summary.split_summary_by_people) || {};
  const youOwe = split_summary_request_data?.data?.you_owe || {};
  const youAreOwed = split_summary_request_data?.data?.you_are_owed || {};

  const allEmails = Array.from(new Set([...Object.keys(youOwe), ...Object.keys(youAreOwed)]));

  const users = allEmails.map((email, index) => {
    const oweAmount = youOwe[email] || 0;
    const owedAmount = youAreOwed[email] || 0;
    const netAmount = owedAmount - oweAmount;

    return {
      id: index + 1,
      email,
      initials: getInitials(email),
      avatarColor: getRandomColor(email),
      oweAmount,
      owedAmount,
      netAmount
    };
  });

  const totalYouOwe = users.filter(user => user.netAmount < 0).reduce((acc, curr) => acc + Math.abs(curr.netAmount), 0);
  const totalYouAreOwed = users.filter(user => user.netAmount > 0).reduce((acc, curr) => acc + curr.netAmount, 0);

  // Modal States
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ email: string, netAmount: number } | null>(null);
  const [settleAmount, setSettleAmount] = useState('');

  const handleOpenDialog = (user: { email: string, netAmount: number }) => {
    setSelectedUser(user);
    setSettleAmount(Math.abs(user.netAmount).toFixed(2));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSettleAmount('');
  };

  const handleSettleUp = () => {
    console.log('Settling up with:', selectedUser?.email, 'Amount:', settleAmount);
    // TODO: Call API to settle the expense
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AXIOS_INSTANCE.post("/settle_up_all_expenses",{
      "settle_user":selectedUser?.email
    }).then((res:any)=>{
      console.log('====================================');
      console.log(res.data);
      console.log('====================================');
      toast.success("Settle up successful");
    }).catch((error)=>{
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      toast.error("Settle up failed");
    })
    handleCloseDialog();
  };

  const generateTip = () => {
    const debtors = users.filter(user => user.netAmount < 0);
    const creditors = users.filter(user => user.netAmount > 0);

    if (debtors.length === 0 && creditors.length === 0) {
      return "You're all settled up — no outstanding balances!";
    }

    if (debtors.length === 0) {
      return "You're only owed money — consider reminding people to settle up!";
    }

    if (debtors.length === 1) {
      const name = debtors[0].email.split('@')[0];
      return `You can settle your balance by paying ${name}.`;
    }

    const topDebtors = debtors
      .sort((a, b) => Math.abs(b.netAmount) - Math.abs(a.netAmount))
      .slice(0, 2)
      .map(user => user.email.split('@')[0]);

    return `You can clear most of your dues by paying ${topDebtors.join(' and ')}.`;
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {/* Summary Boxes */}
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Paper sx={{ p: 3, bgcolor: '#e0f7fa', flex: 1, textAlign: 'center' }}>
          <Typography variant="subtitle1">Owes You</Typography>
          <Typography variant="h5" color="green">${totalYouAreOwed.toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ p: 3, bgcolor: '#ffebee', flex: 1, textAlign: 'center' }}>
          <Typography variant="subtitle1">You Owe</Typography>
          <Typography variant="h5" color="red">${totalYouOwe.toFixed(2)}</Typography>
        </Paper>
      </Box>

      {/* Accordion Tree View */}
      <Typography variant="h6" mb={2}>People You Interact With</Typography>
      {users.map(user => (
        <Accordion key={user.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: user.avatarColor }}>{user.initials}</Avatar>
                <Typography>{user.email}</Typography>
              </Box>
              <Typography sx={{ color: user.netAmount > 0 ? 'green' : user.netAmount < 0 ? 'red' : 'gray' }}>
                ${Math.abs(user.netAmount).toFixed(2)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {user.oweAmount > 0 && (
              <Typography>You owe {user.email} ${user.oweAmount.toFixed(2)}</Typography>
            )}
            {user.owedAmount > 0 && (
              <Typography>{user.email} owes you ${user.owedAmount.toFixed(2)}</Typography>
            )}
            {user.oweAmount === 0 && user.owedAmount === 0 && (
              <Typography>No current transactions with this user.</Typography>
            )}

            <Button
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => handleOpenDialog(user)}
            >
              Settle Up
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Tip Section */}
      <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
        <Typography variant="subtitle1">💡 Tip</Typography>
        <Typography variant="body2" mt={1}>
          {generateTip()}
        </Typography>
      </Paper>

      {/* Settle Up Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Settle Up</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Email"
            fullWidth
            value={selectedUser?.email || ''}
            disabled
          />
          <TextField
            margin="dense"
            label="Amount to Settle"
            fullWidth
            type="number"
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSettleUp} variant="contained" color="primary">
            Settle Up
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseScreen;
