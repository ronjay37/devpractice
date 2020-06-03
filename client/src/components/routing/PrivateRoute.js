import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authProps: { isAuthenticated, loading }, ...rest }) => {
    return (
        <>
            <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login' />) :
        (<Component {...props} />)} />  
        </>
    )
}

PrivateRoute.propTypes = {
    authProps: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    authProps: state.authReducer
});

export default connect(mapStateToProps)(PrivateRoute);
