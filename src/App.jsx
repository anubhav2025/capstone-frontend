// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { useTriggerScanMutation } from "./store/findingsApi";
import SidebarLayout from "./components/SidebarLayout";
import FindingsPage from "./pages/FindingsPage";
import DashboardPage from "./pages/Dashboard";
import HomeScreen from "./pages/homePage/HomeScreen";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import { useGetUserDetailsQuery } from "./store/metricsApi";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./store/authSlice";
import Navbar from "./components/Navbar";
import PageNotFound from "./pages/NotFound";

function App() {
  // For scanning (RTK Mutation)
  const [triggerScan] = useTriggerScanMutation();

  // For fetching user info
  const { data: userInfo } = useGetUserDetailsQuery();
  const dispatch = useDispatch();

  // Save user info to Redux + localStorage (if available)
  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo, dispatch]);

  const handleScan = async () => {
    try {
      await triggerScan().unwrap();
      console.log("Scan triggered successfully");
    } catch (err) {
      console.error("Scan trigger failed:", err);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route WITHOUT sidebar layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route WITH sidebar layout */}
        <Route element={<SidebarLayout onScan={handleScan} />}>
          <Route
            index
            path="/"
            element={
              <>
                <Navbar />
                <HomeScreen />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <DashboardPage />
              </>
            }
          />
          <Route
            path="/findings"
            element={
              <>
                <Navbar />
                <FindingsPage />
              </>
            }
          />
          <Route
            path="/findings/:id"
            element={
              <>
                <Navbar />
                <FindingsPage />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <ProfilePage />
              </>
            }
          />
        </Route>
        <Route path="/*" element={ <PageNotFound/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
