import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _get_user_profile_data1 } from "../../store/middleware/middleware";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

const Profile = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {                                                                  
    console.log("useEffect triggered!");
    dispatch(_get_user_profile_data1());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile_data = useSelector((state: any) => state.user.user_profile_data);
  console.log(profile_data);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 4rem)">
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 300 }}>
        {profile_data.loading ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          </Box>
        ) : (
          <Typography variant="h5" fontWeight="bold">
            Profile Page
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
