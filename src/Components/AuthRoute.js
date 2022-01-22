import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { loginJWT } from '../Redux/actions';
import Loading from './Loading';

// hook state to redirect to history of last requested component
// add initial fetch request for user info if already authenticated so login page doesnt even load if already authenticated from previous login

export const AuthRoute = (props) => {
    const dispatch = useDispatch();
    const Component = props.component;
    const user = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);


    const handleLoginAttempt = async (e) => {
        dispatch(loginJWT(localStorage.getItem('JWT_AUTH_TOKEN'))).then(()=>setLoading(false));
    }

    useEffect(()=>{
        if(localStorage.getItem('JWT_AUTH_TOKEN')!==null){
            handleLoginAttempt();
        }
        else{
            setLoading(false);
        }
        // eslint-disable-next-line
    },[])

    return loading?<Loading />:user.username?<Outlet />:<Navigate to={{ pathname: '/login'}} />;
}

export default AuthRoute
