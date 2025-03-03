import * as Yup from "yup";

export const expensesValidationSchema = Yup.object({
  merchant: Yup.string().required("Merchant is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
});