import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { get_all_groups } from '../../store/middleware/middleware';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GroupsTable = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_all_groups());
  }, [dispatch]);

  // Getting group data from Redux
  const groupsData = useSelector((state: any) => state.groups.get_groups);
  const groups = groupsData?.data?.groups || []; // Ensure safe access

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9', padding: 2 }}>
      
      {/* Table Section - 80% */}
      <Box sx={{ flex: 4, paddingRight: 2 }}>
        <Card elevation={20} >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Group Data
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh', borderRadius: 2 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Group Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Users Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    groups.map((group: any,index:any) => (
                      <TableRow key={group.group_id} hover>
                        <a href={`/group/${group._id}`}>
                        <TableCell>{`Group ID - ${index+1}`}</TableCell>
                        </a>
                        <TableCell>{group.group_name}</TableCell>
                        <TableCell>{group.group_description}</TableCell>
                        <TableCell>{group.group_type}</TableCell>
                        <TableCell>{group.users.length}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No Groups Available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity Section - 20% */}
      <Box sx={{ flex: 1 }}>
        <Card elevation={20}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {groups.length > 0 ? (
              groups.map((group: any) => (
                <Accordion key={group.group_id} sx={{ boxShadow: 1, borderRadius: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold' }}>{group.group_name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{group.group_description}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No Recent Activity</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default GroupsTable;
