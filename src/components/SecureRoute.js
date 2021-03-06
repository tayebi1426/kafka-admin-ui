import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import SecurityService from '../services/SecurityService'

function SecureRoute(props) {
    let {authorities, ...restProps} = props;

    if (authorities && authorities.length > 0) {

        if (!SecurityService.isAuthenticated()) {
            return <Redirect to="/login"/>;
        }
        if (!SecurityService.hasAuthority(authorities)) {
            return <Redirect to="/401"/>;
        }
    }
    return <Route {...restProps}/>;
}

SecureRoute.propTypes = {
    authorities: PropTypes.array,
    exact: PropTypes.bool
};

SecureRoute.defaultProps = {
    exact:true
};

export default SecureRoute;
