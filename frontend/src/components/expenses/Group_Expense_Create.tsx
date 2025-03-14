import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  ListItemText,
  IconButton,
  Autocomplete,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createGroupExpense,
  get_users,
} from "../../store/middleware/middleware";
import { group_expense_create_schema } from "../../utils/validationSchema";
import { _get_expenses_data } from "../../store/middleware/middleware";
import { get_all_groups } from "../../store/middleware/middleware";

interface User {
  email: string;
  firstname: string;
}

const GroupCreateExpense = () => {
  const [open, setOpen] = useState(false);

  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_all_groups());
  }, [dispatch]);
  // Getting group data from Redux
  const groupsData = useSelector((state: any) => state.groups.get_groups);
  const group = groupsData?.data?.groups || []; // Ensure safe access

  useEffect(() => {
    dispatch(get_users());
  }, [dispatch]);
  // Get users data from Redux
  const usersData = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.groups.get_users_for_group
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleParticipantsChange = (event: any, newUsers: any) => {
    setSelectedValues(newUsers);
    const userEmails = newUsers.map((user: any) => user.email);
    formik.setFieldValue("participants", userEmails);
    console.log(formik.errors, "participant ko error");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUsersChange = (event: any, newUsers: User[]) => {
    formik.setFieldValue("paid_by", newUsers);
    console.log(newUsers);
  };

  const formik = useFormik({
    initialValues: {
      expense_name: "",
      date: "",
      amount: "",
      category: "",
      expense_description: "",
      reimbursable: true,
      image: null as File | null,
      split_type: "",
      group: "",
      paid_by: {},
      participants: [],
    },

    
    validationSchema: group_expense_create_schema,
    onSubmit: async (values) => {
      values.split_type = "equal";
      console.log("values", values);
      await dispatch(createGroupExpense(values));
      // await dispatch(_get_expenses_data());
      toast.success("New Expense Created");
      // setOpen(false);
    },
  });

  useEffect(() => {
    const groupId = formik.getFieldProps("group").value;
    console.log("groupId", groupId);
    // if (groupId) {
    //   dispatch(get_users(groupId));
    // }
  }, [formik.values.group, dispatch]);


  const [selectedValues, setSelectedValues] = useState([]);

  //for selecting (set) participants
  // Set default selected values when options are available
  useEffect(() => {
  const options = usersData?.data?.users || []; // Ensure it's an array
    if (options.length > 0) {
      setSelectedValues(options); // Select all users by default
      const userEmails = options.map((user: any) => user.email);
      formik.setFieldValue("participants", userEmails);
    }
  }, [usersData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ListItemText sx={{ cursor: "pointer" }} onClick={handleOpen}>
        Group Create Expense
      </ListItemText>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: "700px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            New Expense
          </Typography>

          <Box
            mt={2}
            component="form"
            onSubmit={formik.handleSubmit}
            className="h-[90%]"
          >
            <div className="overflow-y-auto h-[85%]">
              <TextField
                fullWidth
                label="Expense Name"
                variant="outlined"
                margin="normal"
                name="expense_name"
                value={formik.values.expense_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.expense_name && Boolean(formik.errors.expense_name)
                }
                helperText={formik.touched.expense_name && formik.errors.expense_name}
              />
              <TextField
                fullWidth
                // label="Date"
                type="date"
                variant="outlined"
                margin="normal"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
              {/* <FormControl fullWidth margin="normal"> */}
              {/* <InputLabel>Total</InputLabel> */}
              <TextField
                fullWidth
                label="Total"
                type="number"
                variant="outlined"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
              {/* </FormControl> */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.reimbursable}
                    name="reimbursable"
                    onChange={formik.handleChange}
                  />
                }
                label="Reimbursable"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  variant="outlined"
                  margin="none"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.category && Boolean(formik.errors.category)
                  }
                >
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Supplies">Supplies</MenuItem>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <Typography
                    className="pl-4 !text-[12px] pt-1"
                    variant="caption"
                    color="error"
                  >
                    {formik.errors.category}
                  </Typography>
                )}
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                name="expense_description"
                value={formik.values.expense_description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.expense_description &&
                  Boolean(formik.errors.expense_description)
                }
                helperText={
                  formik.touched.expense_description && formik.errors.expense_description
                }
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Group</InputLabel>
                <Select
                  label="Group"
                  name="group"
                  variant="outlined"
                  margin="none"
                  value={formik.values.group}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.group && Boolean(formik.errors.group)}
                >
                  {group.map((group: any) => (
                    <MenuItem key={group._id + "group"} value={group.group_id}>
                      {group.group_name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.group && formik.errors.group && (
                  <Typography
                    className="pl-4 !text-[12px] pt-1"
                    variant="caption"
                    color="error"
                  >
                    {formik.errors.group}
                  </Typography>
                )}
              </FormControl>

            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                options={usersData?.data?.users ? usersData.data?.users : []} // Ensure it's an array
                value={selectedValues}
                getOptionLabel={(option: any) =>
                  option?.firstname || option.email
                } // Display firstname or email
                onChange={handleParticipantsChange}
                renderTags={(selected, getTagProps) => {
                  console.log(selected, "selected", formik.values.participants);
                  return selected.map((option: any, index: number) => (
                    <Chip
                      label={option.firstname} // Show firstname instead of avatar
                      {...getTagProps({ index })}
                      key={option.id + index + "participants"}
                      deleteIcon={
                        <CloseIcon
                          style={{
                            color: "white",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                      }
                      sx={{
                        "& .MuiChip-deleteIcon": {
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                        },
                        mb: 3,
                      }}
                    />
                  ));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Participants" />
                )}
              />
              {formik.touched.participants && formik.errors.participants && (
                  <Typography
                    className="pl-4 !text-[12px] pt-1"
                    variant="caption"
                    color="error"
                  >
                    {formik.errors.participants as string}
                  </Typography>
                )}
            </FormControl>

              <FormControl fullWidth margin="normal">
                {/* Single-Select with Firstname */}
                <Autocomplete
                  options={usersData?.data?.users ? usersData.data?.users : []} // Ensure it's an array
                  getOptionLabel={(option) => option.firstname} // Show firstname
                  value={group.users}
                  onChange={handleUsersChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Paid by"
                      placeholder="Select users"
                    />
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option: any, index: number) => (
                      <Chip
                        label={option.firstname} // Show firstname instead of avatar
                        {...getTagProps({ index })}
                        key={option.id + index + "paid_by"}
                        // onDelete={() => {
                        //   // Here, we are removing the specific user based on the ID
                        //   setGroup({
                        //     ...group,
                        //     users: group.users.filter(
                        //       (user: any) => user.id !== option.id
                        //     ), // Remove only the selected user
                        //   });
                        // }}
                        deleteIcon={
                          <CloseIcon
                            style={{
                              color: "white",
                              backgroundColor: "red",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                            }}
                          />
                        }
                        sx={{
                          "& .MuiChip-deleteIcon": {
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                          },
                          mb: 3,
                        }}
                      />
                    ))
                  }
                />
                {formik.touched.paid_by && formik.errors.paid_by && (
                  <Typography
                    className="pl-4 !text-[12px] pt-1"
                    variant="caption"
                    color="error"
                  >
                    {formik.errors.paid_by as string}
                  </Typography>
                )}
              </FormControl>
              <Button
                className="!mt-4"
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      formik.setFieldValue(
                        "image",
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                />
              </Button>
              {formik.values.image && (
                <Box mt={2} display="flex" alignItems="center">
                  <Typography>
                    Selected file: {formik.values.image.name}
                  </Typography>
                  <IconButton
                    onClick={() => formik.setFieldValue("image", null)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </div>
            <Box mt={2} className="flex justify-between gap-4 !font-bold">
              <Button onClick={handleClose} className="!bg-red-600 !text-white">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Expense
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GroupCreateExpense;
