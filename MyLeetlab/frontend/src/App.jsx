import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AddProblem from "./page/AddProblem";
import AdminRoute from "./components/AdminRoute";
import ProblemPage from "./page/ProblemPage";
import ThemeToggleButton from "./components/ThemeToggleButton";
import PageNotFound from "./page/PageNotFound";
import Profile from "./page/Profile";
import ForgotPassword from "./page/ForgotPassword";
import VerifyEmail from "./page/VerifyEmail";
import EditProblem from "./page/EditProblem";
import PortfolioPage from "./page/PortfolioPage";
function App() {
  // giving useful routes to the user as per the authentication
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // as soon as checkauth changes, use checkAuth function
  // it will also update checkAuth on first render
  useEffect(() => {
    checkAuth()
    console.log(authUser)
  }, [])

  // if something is loading, show loader only in page
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  return (
    <>
      {/* {console.log(authUser)} */}
      <Toaster />
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route 
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Route>

        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />

        <Route 
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route 
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={<AddProblem />}
          />
          <Route 
            path="/edit-problem/:id"
            element={<EditProblem />}
          />
        </Route>

        <Route
          path="/developer-portfolio"
          element={<PortfolioPage/>}
        />

        <Route path="/404-page-not-found" element={<PageNotFound />} />

        <Route path="*" element={<Navigate to="/404-page-not-found" />} />
      </Routes>
    </>
  );
}

export default App;
