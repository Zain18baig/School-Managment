import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Header from "./components/Header";
import Teachers from "./components/Teachers";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

function App() {
  // State to track the number of students and teachers

  return (
    <Router>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
      </Routes>
    </Router>
  );
}

export default App;
