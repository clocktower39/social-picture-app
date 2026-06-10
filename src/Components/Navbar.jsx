import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Home,
  Search,
  AddBox,
  AccountCircle,
  Login as LoginIcon,
  PersonAdd,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
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
  const isLoggedIn = Boolean(user && user._id);

  const handleChange = (event, newValue) => {
    setDisableNav(true);
    setValue(newValue);
    setDisableNav(false);
  };

  useEffect(() => {
    handleChange(null, location.pathname);
  }, [location.pathname]);

  if (!isLoggedIn) {
    return (
      <BottomNavigation value={value} onChange={handleChange} sx={classes.root}>
        <BottomNavigationAction
          disabled={disableNav}
          label="Explore"
          value="/explore"
          to="/explore"
          icon={<Search />}
          component={Link}
        />
        <BottomNavigationAction
          disabled={disableNav}
          label="Login"
          value="/login"
          to="/login"
          icon={<LoginIcon />}
          component={Link}
        />
        <BottomNavigationAction
          disabled={disableNav}
          label="Sign up"
          value="/signup"
          to="/signup"
          icon={<PersonAdd />}
          component={Link}
        />
      </BottomNavigation>
    );
  }

  return (
    <BottomNavigation value={value} onChange={handleChange} sx={classes.root}>
      <BottomNavigationAction disabled={disableNav} label="Home" value="/" to='/' icon={<Home />} component={Link} />
      <BottomNavigationAction disabled={disableNav} label="Explore" value="/explore" to='/explore' icon={<Search />} component={Link} />
      <BottomNavigationAction
        disabled={disableNav}
        label="Messages"
        value="/messages"
        to='/messages'
        icon={<MailIcon />}
        component={Link}
      />
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
