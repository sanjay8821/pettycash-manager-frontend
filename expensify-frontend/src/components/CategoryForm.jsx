import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransaction } from "../redux/slices/transactionSlice";
import { useTheme } from "@emotion/react";
import { topleftalert } from "../utils/alert";
import { getUser } from "../redux/slices/authSlice";
import HouseIcon from "@mui/icons-material/House";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import TuneIcon from "@mui/icons-material/Tune";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const icons = [
  { icon: <HouseIcon />, label: "Housing" },
  { icon: <AddShoppingCartIcon />, label: "Shoping" },
  { icon: <DirectionsCarIcon />, label: "Transportation" },
  { icon: <LocalDiningIcon />, label: "Food" },
  { icon: <MedicalServicesIcon />, label: "Medical/Healthcare" },
  { icon: <TuneIcon />, label: "Default" },
];

const initialFormData = {
  label: "",
  icon: "",
  category_id: "",
};

function CategoryForm({ editCategory, setEditCategory }) {
  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const theme = useTheme();

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleIconChange = (value) => {
    if (value) {
      setFormData({ ...formData, icon: value.label });
    }
  };

  async function createCategory() {
    const response = await fetch(`${BASE_API_URL}/category`, {
      method: "POST",
      headers: {
        "auth-token": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const _user = {
        ...user,
        categories: [{ ...formData }, ...user.categories],
      };
      dispatch(getUser({ user: _user }));
      topleftalert({ message: "Added Successfully", icon: "success" });
    }
  }

  async function updateCategory() {
    await fetch(`${BASE_API_URL}/category/${editCategory._id}`, {
      method: "PATCH",
      headers: {
        "auth-token": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    topleftalert({ message: "Updated Successfully", icon: "success" });
    setEditCategory({});
    const _user = {
      ...user,
      categories: user.categories.map((category) =>
        category._id == editCategory._id ? formData : category
      ),
    };
    dispatch(getUser({ user: _user }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    editCategory._id === undefined ? createCategory() : updateCategory();
    setFormData(initialFormData);
  }

  useEffect(() => {
    if (editCategory._id !== undefined) {
      setFormData(editCategory);
    }
  }, [editCategory]);

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
          Add New Category
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
            type="string"
            name="label"
            autoComplete="off"
            size="small"
            id="label"
            label="Label"
            fullWidth
            value={formData.label}
            onChange={handleInputChange}
            variant="outlined"
            required
          />

          <Autocomplete
            freeSolo
            value={formData.icon}
            onChange={(event, newValue) => {
              handleIconChange(newValue);
            }}
            inputValue={formData.category}
            id="icons"
            name="icon"
            options={icons}
            renderOption={(props, option) => (
              <Box
                component={"li"}
                sx={{
                  "& .mycustomtemp": {
                    marginRight: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
                {...props}
              >
                <Box className="mycustomtemp">{option.icon}</Box>
                {option.label}
              </Box>
            )}
            size="small"
            fullWidth
            renderInput={(params) => (
              <TextField required {...params} label="Icons" />
            )}
          />

          {editCategory._id == undefined ? (
            <Button
              size="small"
              sx={{ width: { xs: "100%", sm: "100%", md: "250px" } }}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          ) : (
            <Button
              size="small"
              sx={{ width: { xs: "100%", sm: "250px" } }}
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

export default CategoryForm;
