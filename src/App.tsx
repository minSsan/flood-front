import React, { useRef, useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { koKR } from "@mui/material/locale";
import Result from "./pages/Result/Result";
import { Routes, Route } from "react-router-dom";
import InputLocation from "./pages/InputLocation/InputLocation";

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
        <Routes>
          <Route index element={<Home />} />
          <Route path="/location" element={<InputLocation />} />
          <Route path="/complete" element={<Result />} />
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
