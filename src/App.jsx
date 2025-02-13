// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const [triggerScan] = useTriggerScanMutation();
  const { data: userInfo } = useGetUserDetailsQuery();
  const dispatch = useDispatch();

  // On mount, store user info
  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo, dispatch]);

  const handleScan = async () => {
    // You can handle a global scan if you wish
    await triggerScan({ tenantId: "", tools: ["ALL"] });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
