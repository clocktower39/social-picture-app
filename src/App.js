import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Post from "./Components/Post";
import Profile from "./Components/Profile";
import Account from "./Components/Account";
import Navbar from "./Components/Navbar";
import AuthRoute from "./Components/AuthRoute";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from './theme';
import "./App.css";


function App() {
  return (
    <ThemeProvider theme={theme} >
      <Router basename="/social-picture-app/">
        <div style={{ marginBottom: '75px' }}>
          <Routes>
            <Route exact path="/login" element={<Login />} />

            <Route exact path="/signup" element={<Signup />} />

            <Route exact path="/" element={<AuthRoute />} >
              <Route exact path="/" element={<Home />} />
            </Route>

            <Route exact path="/search" element={<AuthRoute />} >
              <Route exact path="/search" element={<Search />} />
            </Route>

            <Route exact path="/post" element={<AuthRoute />} >
              <Route exact path="/post" element={<Post />} />
            </Route>

            <Route exact path="/account" element={<AuthRoute />} >
              <Route exact path="/account" element={<Account />} />
            </Route>

            <Route exact path="/profile" element={<AuthRoute />} >
              <Route exact path="/profile/:username" element={<Profile />} />
            </Route>
          </Routes>
        </div>
        <Navbar />
      </Router>
    </ThemeProvider>
  );
}

export default App;
