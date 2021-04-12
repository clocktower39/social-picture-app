import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Home, Search, AddCircle, AccountCircle } from '@material-ui/icons';
import { Link } from 'react-router-dom';

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
  const [value, setValue] = React.useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Home" value="home" to='/' icon={<Home />} component={Link} />
      <BottomNavigationAction label="Search" value="search" to='/search' icon={<Search />} component={Link} />
      <BottomNavigationAction label="Post" value="post" to='/post' icon={<AddCircle />} component={Link} />
      <BottomNavigationAction label="Account" value="account" to='/account' icon={<AccountCircle />} component={Link} />
    </BottomNavigation>
  );
}
