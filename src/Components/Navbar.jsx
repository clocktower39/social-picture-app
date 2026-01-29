import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Search, AddCircle, AccountCircle, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const classes = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 100
  },
};

export default function Navbar() {
  const user = useSelector(state => state.user);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
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
    <BottomNavigation value={value} onChange={handleChange} sx={classes.root}>
      <BottomNavigationAction disabled={disableNav} label="Home" value="/" to='/' icon={<Home />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Explore" value="/explore" to='/explore' icon={<Search />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Post" value="/post" to='/post' icon={<AddCircle />} component={Link} />
      <BottomNavigationAction
        disabled={disableNav}
        label="Notifications"
        value="/notifications"
        to='/notifications'
        icon={
          <Badge color="error" badgeContent={unreadCount || 0} overlap="circular">
            <NotificationsIcon />
          </Badge>
        }
        component={Link}
      />
      <BottomNavigationAction disabled={disableNav} label="Profile" value={`/profile/${user.username}`} to={`/profile/${user.username}`} icon={<AccountCircle />} component={Link} />
    </BottomNavigation>
  );
}
