import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Post from "./Components/Post";
import Account from "./Components/Account";
import Navbar from "./Components/Navbar";
import AuthRoute from "./Components/AuthRoute";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { theme } from './theme';
import "./App.css";


function App() {
  return (
    <ThemeProvider theme={theme} >
      <div>
        <Router basename="/social-picture-app/">
          <Switch>
            <Route exact path="/login" children={<Login />} />

            <Route exact path="/signup" children={<Signup />} />

            <AuthRoute exact path="/" component={Home} />

            <AuthRoute exact path="/search" component={Search} />

            <AuthRoute exact path="/post" component={Post} />

            <AuthRoute exact path="/account" component={Account} />
          </Switch>
          <Navbar />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
