import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransaction } from "../redux/slices/transactionSlice";
import { useTheme } from "@emotion/react";
import { topleftalert } from "../utils/alert";

const initialFormData = {
  amount: "",
  description: "",
  date: Date.now(),
  category_id: "",
};

function TransactionForm({ editTransaction, setEditTransaction }) {
  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const { categories } = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const theme = useTheme();

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleChange = (newValue) => {
    setFormData({ ...formData, date: newValue });
  };

  const getCategoryByName = () => {
    return (
      categories.find((category) => category._id === formData.category_id) ?? ""
    );
  };

  async function createTransaction() {
    const response = await fetch(`${BASE_API_URL}/transaction`, {
      method: "POST",
      headers: {
        "auth-token": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      topleftalert({ message: "Added Successfully", icon: "success" });
    }
    dispatch(fetchTransaction());
  }

  async function updateTransaction() {
    const response = await fetch(
      `${BASE_API_URL}/transaction/${editTransaction.date}`,
      {
        method: "PATCH",
        headers: {
          "auth-token": token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    topleftalert({ message: "Updated Successfully", icon: "success" });
    dispatch(fetchTransaction());
    setEditTransaction({});
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const res =
      editTransaction.amount === undefined
        ? createTransaction()
        : updateTransaction();

    setFormData(initialFormData);
  }

  useEffect(() => {
    if (editTransaction.amount !== undefined) {
      setFormData(editTransaction);
    }
  }, [editTransaction]);

  useEffect(() => {
    dispatch(fetchTransaction());
  }, []);

  return (
    <Card sx={{ minWidth: 275, mt: 10 }}>
      <CardContent>
        <Typography
          sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}
          padding={1}
          marginBottom={3}
          textAlign={"center"}
          variant="h6"
        >
          Add Transaction
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleFormSubmit}
          sx={{
            gap: 2,
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            flexDirection: { xs: "column", sm: "column", md: "row" },
          }}
        >
          <TextField
            type="number"
            name="amount"
            autoComplete="off"
            size="small"
            id="amount"
            label="Amount"
            fullWidth
            value={formData.amount}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
          <TextField
            size="small"
            id="description"
            label="Description"
            name="description"
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            required
            fullWidth
            autoComplete="off"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Pick date"
              inputFormat="MM/DD/YYYY"
              onChange={handleChange}
              value={formData.date}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  id="date"
                  required
                  name="date"
                  size="small"
                  {...params}
                />
              )}
            />
          </LocalizationProvider>

          <Autocomplete
            freeSolo
            value={getCategoryByName()}
            onChange={(event, newValue) => {
              setFormData({ ...formData, category_id: newValue?._id });
            }}
            inputValue={formData.category}
            id="category"
            name="category"
            options={categories}
            size="small"
            fullWidth
            renderInput={(params) => (
              <TextField required {...params} label="Category" />
            )}
          />

          {editTransaction.amount == undefined ? (
            <Button
              size="small"
              sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          ) : (
            <Button
              size="small"
              sx={{ width: { xs: "100%", sm: "100%" } }}
              variant="contained"
              type="submit"
            >
              Update
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TransactionForm;
