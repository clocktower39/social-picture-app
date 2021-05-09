import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Search from './Components/Search';
import Post from './Components/Post';
import Account from './Components/Account';
import Navbar from './Components/Navbar';
import AuthRoute from './Components/AuthRoute';
import { makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

const useStyles = makeStyles({
  App: {
  },
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.App}>
      <Router>
        <Switch>
          <Route exact path='social-picture-app/login' children={<Login/>} />
          
          <Route exact path='social-picture-app/signup' children={<Signup/>} />

          <AuthRoute exact path='social-picture-app/' component={Home} />
          
          <AuthRoute exact path='social-picture-app/search' component={Search} />
          
          <AuthRoute exact path='social-picture-app/post' component={Post} />
          
          <AuthRoute exact path='social-picture-app/account' component={Account} />
            
        </Switch>
        <Navbar />
      </Router>
    </div>
  );
}

export default App;
