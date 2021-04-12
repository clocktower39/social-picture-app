import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export const AuthRoute = (props) => {
    const Component = props.component;
    const isAuthenticated = props.authenticated;


    return (isAuthenticated === true)?<Component />:<Redirect to={{ pathname: '/login'}} />;
}

const mapStateToProps = (state) => ({
    authenticated: state.authenticated
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
