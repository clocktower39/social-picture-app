import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Explore from "./Components/Explore";
import Post from "./Components/Post";
import Messages from "./Components/Messages";
import Profile from "./Components/Profile";
import Notifications from "./Components/Notifications";
import TagResults from "./Components/TagResults";
import Navbar from "./Components/Navbar";
import AuthRoute from "./Components/AuthRoute";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from './theme';
import { getNotifications, socketNotification } from "./Redux/actions";
import "./App.css";

function App({ socket }) {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.user.themeMode);
  const user = useSelector((state) => state.user);
  const [themeSelection, setThemeSelection] = useState(theme());

  useEffect(() => {
    setThemeSelection(theme());
  }, [themeMode]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getNotifications());
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!socket) return;
    const token = localStorage.getItem("JWT_AUTH_TOKEN");
    if (user && user._id && token) {
      socket.emit("join_user", { token });
    }
  }, [socket, user?._id]);

  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data) => dispatch(socketNotification(data));
    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket, dispatch]);

  return (
    <ThemeProvider theme={themeSelection}>
      <CssBaseline />
      <Router basename="/social-picture-app/">
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100%', paddingBottom: '72px' }}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route element={<AuthRoute />}>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/explore" element={<Explore />} />
              <Route exact path="/post" element={<Post />} />
              <Route exact path="/messages" element={<Messages socket={socket} />} />
              <Route exact path="/notifications" element={<Notifications />} />
              <Route exact path="/profile/:username" element={<Profile />} />
              <Route exact path="/tag/:tag" element={<TagResults />} />
            </Route>
          </Routes>
        </Box>
        <Navbar />
      </Router>
    </ThemeProvider>
  );
}

export default App;
