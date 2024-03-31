import {
  CircularProgress,
  createTheme,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getUser } from "../redux/slices/authSlice";
import Header from "./Header";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8758FF",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#F2F2F2",
      paper: "#F2F2F2",
    },
  },
});

function Layout() {
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  async function fetchUser() {
    setIsloading(true);
    const res = await fetch(`${BASE_API_URL}/verifyUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const user = await res.json();
    if (res.ok) {
      dispatch(getUser(user));
    }
    setIsloading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <main>
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

export default Layout;
