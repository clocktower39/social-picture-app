import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../Redux/actions';

// hook state to redirect to history of last requested component
// add initial fetch request for user info if already authenticated so login page doesnt even load if already authenticated from previous login

export const AuthRoute = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const Component = props.component;
    const isAuthenticated = useSelector(state => state.authenticated);

    const handleLoginAttempt = async(e) => {
        //change into post request to login, if successful then dispatch login with returned data
        let loginAttempt = JSON.stringify({username:localStorage.getItem('username'), password:'', authenticated: localStorage.getItem('authenticated') });

        dispatch(loginUser(loginAttempt));
    }

    // need to make this async somehow... I need to focus on something else for now, good luck future me
    useEffect(()=>{
        if(localStorage.getItem('username') && localStorage.getItem('authenticated')){
            handleLoginAttempt();
            setTimeout(()=>{setLoading(false)},1000)
        }
        // eslint-disable-next-line
    },[])

    return loading?<>LOADING</>:(isAuthenticated === true)?<Component />:<Redirect to={{ pathname: '/login'}} />;
}

export default AuthRoute
