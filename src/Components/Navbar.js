import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Home, Search, AddCircle, AccountCircle } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

export default function Navbar() {
  const classes = useStyles();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const [disableNav, setDisableNav] = useState(false);

  const handleChange = (event, newValue) => {
    setDisableNav(true);
    setValue(newValue);
      setDisableNav(false);
  };


useEffect(()=>{
  handleChange(null, location.pathname);
},[location.pathname])

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction disabled={disableNav} label="Home" value="/" to='/' icon={<Home />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Search" value="/search" to='/search' icon={<Search />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Post" value="/post" to='/post' icon={<AddCircle />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Account" value="/account" to='/account' icon={<AccountCircle />} component={Link} />
    </BottomNavigation>
  );
}
