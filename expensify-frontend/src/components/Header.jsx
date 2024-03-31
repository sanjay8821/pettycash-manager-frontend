import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/slices/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  function goToLogin() {
    navigate("/login");
  }
  function goToCategory() {
    navigate("/category");
  }
  function goToRegister() {
    navigate("/register");
  }

  function goToHome() {
    navigate("/");
  }

  function logout() {
    localStorage.removeItem("token");
    dispatch(removeUser());
    navigate("/login");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{ cursor: "pointer" }}
              onClick={goToHome}
            >
              Expensify
            </Typography>
          </Box>
          {auth.isAuthenticated ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button onClick={logout} color="inherit">
                Logout
              </Button>
              <Button onClick={goToCategory} color="inherit">
                Category
              </Button>
              <Typography component="p" variant="h6">
                {auth?.user?.name}
              </Typography>
            </Box>
          ) : (
            <>
              <Button onClick={goToLogin} color="inherit">
                Login
              </Button>
              <Button onClick={goToRegister} color="inherit">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
