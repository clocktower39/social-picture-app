import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// hook state to redirect to history of last requested component
// add initial fetch request for user info if already authenticated so login page doesnt even load if already authenticated from previous login

export const AuthRoute = (props) => {
    const Component = props.component;
    const isAuthenticated = props.authenticated;

    useEffect(() => {
        
    }, [])

    return (isAuthenticated === true)?<Component />:<Redirect to={{ pathname: '/login'}} />;
}

const mapStateToProps = (state) => ({
    authenticated: state.authenticated
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
