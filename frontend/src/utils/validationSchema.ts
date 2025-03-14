import * as Yup from "yup";

export const manual_expense_create_schema = Yup.object().shape({
  merchant: Yup.string().required("Merchant is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
});

export const group_expense_create_schema = Yup.object().shape({
  expense_name: Yup.string().required("Expense name is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  category: Yup.string().required("Category is required"),
  expense_description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  group: Yup.string().required("Group is required"),
      // split_type: Yup.string().required("Split type is required"),
      participants: Yup.array()
        .of(Yup.string().required("Each participant must be a valid string"))
        .min(1, "At least one participant is required")
        .required("Participants is required"),
      paid_by: Yup.object()
        .test(
          "not-empty",
          "Select a user who paid the expense",
          (value: any) => {
            console.log(value);
            return (
              value &&
              typeof value === "object" &&
              Object.keys(value).length > 0
            );
          }
        )
        .required("Paid by is required"),
});

