import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { fetchTransaction, remove } from "../redux/slices/transactionSlice";
import Swal from "sweetalert2";
import formatDate from "../utils/utlis";

function TransactionsTable({ setEditTransaction }) {
  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const theme = useTheme();

  const { transactions, loading } = useSelector((state) => state.transaction);
  const user = useSelector((state) => state.auth.user);

  function showCategoryNameById(id) {
    const category = user.categories.find((Category) => Category._id == id);

    return category ? category.label : "NA";
  }

  async function removeTransaction(id) {
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
        const res = await fetch(`${BASE_API_URL}/transaction/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        });
        if (res.ok) {
          dispatch(fetchTransaction());
          Swal.fire("Deleted!", "Transaction deleted successfully", "success");
        }
      }
    });
  }

  return (
    <>
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
          List of Transactions
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"> Amount</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((month) =>
                month?.transactions?.map((transaction) => {
                  const { _id, amount, description, date, category_id } =
                    transaction;
                  return (
                    <TableRow
                      key={date}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center" component="th" scope="row">
                        {amount}
                      </TableCell>
                      <TableCell align="center">{description}</TableCell>
                      <TableCell align="center">
                        {showCategoryNameById(category_id)}
                      </TableCell>
                      <TableCell align="center">{formatDate(date)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => setEditTransaction(transaction)}
                          color="primary"
                        >
                          <EditSharpIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => removeTransaction(date)}
                          color="primary"
                        >
                          <DeleteSharpIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default TransactionsTable;
