import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CardActions,
  Button,
  List,
  ListItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { get_receipt_by_id } from '../../store/middleware/middleware';

const ViewReceipt = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const { receipt_id } = useParams();

  useEffect(() => {
    if (receipt_id) dispatch(get_receipt_by_id(receipt_id));
  }, [dispatch, receipt_id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const receiptData = useSelector((state: any) => state.receipts.get_receipt_by_id.data);

  const receiptInfo = receiptData?.receipt_information;
  const extractedInfo = receiptData?.extracted_information;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        View Receipt
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side - Receipt Details */}
        <Grid item xs={12} md={7}>
          {receiptInfo && (
            <Card sx={{ width: '100%', borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <CardMedia
                component="img"
                height="350"
                image={receiptInfo.receipt_image}
                alt={receiptInfo.receipt_name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {receiptInfo.receipt_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {receiptInfo.receipt_description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(receiptInfo.created_at).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => window.open(receiptInfo.receipt_image, '_blank')}>
                  Download
                </Button>
              </CardActions>
            </Card>
          )}
        </Grid>

        {/* Right Side - Extracted Info */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 3,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Extracted Information
              </Typography>

              {extractedInfo ? (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Items:
                  </Typography>
                  <List dense>
                    {extractedInfo.items?.map((item: { name: string; price: string }, index: number) => (
                      <ListItem
                        key={index}
                        sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}
                      >
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2">${item.price}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Subtotal: ${extractedInfo.subtotal || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Tax: ${extractedInfo.tax || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Total: ${extractedInfo.total || 'N/A'}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Merchant: {extractedInfo.merchant_name || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Address: {extractedInfo.merchant_address || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Purchase Date: {extractedInfo.purchase_date || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Category: {extractedInfo.category || 'N/A'}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">No extracted data available.</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewReceipt;
