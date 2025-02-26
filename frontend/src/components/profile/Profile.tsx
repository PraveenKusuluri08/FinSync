import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _get_user_profile_data1 } from "../../store/middleware/middleware";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { UserProfileType } from "../../types/user";

const Profile = () => {
  const userData = window.localStorage.getItem("user_info");
  
  const user_info:UserProfileType|undefined = userData ? JSON.parse(userData) : undefined;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 4rem)"
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 300 }}>
        {/* {profile_data.loading ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          </Box>
        ) : ( */}
          <>
            <Typography variant="h5" fontWeight="bold">
              Profile Page
            </Typography>

            <div className="bg-white overflow-hidden shadow rounded-lg">
                <p className="mt-1 max-w-2xl text-sm text-gray-500 pb-2">
                  This is some information about the user.
                </p>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user_info?.firstname + " " + user_info?.lastname}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user_info?.email}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user_info?.phone_number}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      123 Main St
                      <br />
                      Anytown, USA 12345
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        {/* )} */}
      </Paper>
    </Box>
  );
};

export default Profile;
