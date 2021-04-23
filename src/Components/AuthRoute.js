import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../Redux/actions';

// hook state to redirect to history of last requested component
// add initial fetch request for user info if already authenticated so login page doesnt even load if already authenticated from previous login

export const AuthRoute = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const Component = props.component;
    const isAuthenticated = props.authenticated;

    const handleLoginAttempt = (e) => {
        //change into post request to login, if successful then dispatch login with returned data
        let loginAttempt = JSON.stringify({username:localStorage.getItem('username'), password:'', authenticated: localStorage.getItem('authenticated') });

        dispatch(loginUser(loginAttempt));
    }

    useEffect(()=>{
        if(localStorage.getItem('username') && localStorage.getItem('authenticated')){
            handleLoginAttempt();
        }
        // eslint-disable-next-line
    },[])

    return (isAuthenticated === true)?<Component />:<Redirect to={{ pathname: '/login'}} />;
}

const mapStateToProps = (state) => ({
    authenticated: state.authenticated
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
