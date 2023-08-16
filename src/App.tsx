import React, { useRef, useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { koKR } from "@mui/material/locale";
import Result from "./pages/Result/Result";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  koKR
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <Home /> */}
        <Result />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
