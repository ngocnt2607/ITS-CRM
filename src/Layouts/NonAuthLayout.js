import React from 'react';
import { withRouter } from 'react-router-dom';

const NonAuthLayout = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default withRouter(NonAuthLayout);