// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import TicketsPage from "./pages/TicketsPage";
import FindingsPage from "./pages/FindingsPage";
import DashboardPage from "./pages/Dashboard";
import HomeScreen from "./pages/homePage/HomeScreen";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useGetUserDetailsQuery } from "./store/metricsApi";
import { setUserInfo } from "./store/authSlice";
import { useDispatch } from "react-redux";

function App() {
  const { data: userInfo } = useGetUserDetailsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Layout with sidebar */}
        <Route element={<SidebarLayout />}>
          <Route
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

          {/* 
            TICKETS: Nested routes
            /tickets         -> show table
            /tickets/:ticketId -> same page, but open a ticket modal 
          */}
          <Route path="/tickets" element={<><Navbar /><TicketsPage/></>}>
            <Route path=":ticketId"  />
          </Route>

        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
