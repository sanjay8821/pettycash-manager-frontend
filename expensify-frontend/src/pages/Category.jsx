import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { Container, IconButton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import Swal from "sweetalert2";
import { getUser } from "../redux/slices/authSlice";
import CategoryForm from "../components/CategoryForm";
import { useState } from "react";

function Category() {
  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const [editCategory, seteditCategory] = useState({});

  const dispatch = useDispatch();
  const theme = useTheme();

  const user = useSelector((state) => state.auth.user);

  function setEdit(category) {
    seteditCategory(category);
  }

  async function removeCategory(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      backdrop: `
      rgba(0,0,123,0.4)
  `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`${BASE_API_URL}/category/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const _user = {
            ...user,
            categories: user.categories.filter(
              (category) => category._id != id
            ),
          };
          dispatch(getUser({ user: _user }));
          Swal.fire("Deleted!", "Transaction deleted successfully", "success");
        }
      }
    });
  }

  return (
    <Container>
      <CategoryForm
        editCategory={editCategory}
        setEditCategory={seteditCategory}
      />
      <Box
        sx={{
          background: theme.palette.background.paper,
          textAlign: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Typography
          sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}
          padding={2}
          variant="h6"
        >
          Categories
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"> Label </TableCell>
                <TableCell align="center"> Icon </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.categories?.map((category, idx) => {
                const { label, icon, _id } = category;
                return (
                  <TableRow
                    key={label + idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {label}
                    </TableCell>
                    <TableCell align="center">{icon}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => setEdit(category)}
                        color="primary"
                      >
                        <EditSharpIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => removeCategory(_id)}
                        color="primary"
                      >
                        <DeleteSharpIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default Category;
