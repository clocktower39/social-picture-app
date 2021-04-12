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
    height: '100%',
    display: 'flex',
    flexDirection:' column',
    alignItems: 'center',
  },
  navbar: {
  },
  main: {
  },
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.App}>
      <Router>
        <Switch>
          <Route exact path='/login' children={<Login/>} />
          
          <Route exact path='/signup' children={<Signup/>} />

          <AuthRoute exact path='/' component={Home} />
          
          <AuthRoute exact path='/search' component={Search} />
          
          <AuthRoute exact path='/post' component={Post} />
          
          <AuthRoute exact path='/account' component={Account} />
            

        </Switch>
        <Navbar className={classes.navbar}/>
      </Router>
    </div>
  );
}

export default App;
