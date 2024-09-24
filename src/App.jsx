import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Explore from "./Components/Explore";
import Post from "./Components/Post";
import Messages from "./Components/Messages";
import Profile from "./Components/Profile";
import Navbar from "./Components/Navbar";
import AuthRoute from "./Components/AuthRoute";
import { Box, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from './theme';
import "./App.css";


function App({ socket }) {
  const themeMode = useSelector(state => state.user.themeMode);
  const [themeSelection, setThemeSelection] = useState(theme());

  useEffect(()=>{
    setThemeSelection(theme());
  },[themeMode])

  return (
    <ThemeProvider theme={themeSelection} >
      <Router >
        <Box sx={{  backgroundColor: 'background.default', minHeight: '100%' }}>
          <Routes>
            <Route exact path="/login" element={<Login />} />

            <Route exact path="/signup" element={<Signup />} />

            <Route exact path="/" element={<AuthRoute />} >
              <Route exact path="/" element={<Home />} />
            </Route>

            <Route exact path="/explore" element={<AuthRoute />} >
              <Route exact path="/explore" element={<Explore />} />
            </Route>

            <Route exact path="/post" element={<AuthRoute />} >
              <Route exact path="/post" element={<Post />} />
            </Route>

            <Route exact path="/messages" element={<AuthRoute />} >
              <Route exact path="/messages" element={<Messages socket={socket} />} />
            </Route>

            <Route exact path="/profile" element={<AuthRoute />} >
              <Route exact path="/profile/:username" element={<Profile />} />
            </Route>
          </Routes>
        </Box>
        <Navbar />
      </Router>
    </ThemeProvider>
  );
}

export default App;
