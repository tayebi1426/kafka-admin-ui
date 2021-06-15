import React from "react";
import PropTypes from "prop-types";
import {Switch, Route} from 'react-router-dom';

function SwitchRouter({routes, children}) {
    return <Switch>
        {
            (routes && routes.length > 0) ? routes.map(r => <Route key={r.path} {...r}/>) : children
        }
    </Switch>
}

SwitchRouter.propTypes = {
    routes: PropTypes.array
};

export default SwitchRouter;
