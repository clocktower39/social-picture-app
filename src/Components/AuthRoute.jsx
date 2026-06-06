import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { loginJWT } from '../Redux/actions';
import Loading from './Loading';

export const AuthRoute = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem("JWT_REFRESH_TOKEN")) {
            dispatch(loginJWT()).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [dispatch]);

    if (loading) return <Loading />;
    if (!user.username) return <Navigate to="/login" replace />;
    return <Outlet />;
};

export default AuthRoute;
