import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  // giving useful routes to the user as per the authentication
  let authUser = null;
  return (
    <>

      <Toaster/>
      <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <LoginPage />}
          />

          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUpPage />}
          />
        </Routes>
    </>
  );
}

export default App;
