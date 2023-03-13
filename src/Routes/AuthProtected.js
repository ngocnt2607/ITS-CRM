import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import addToast from '../Components/Common/add-toast.component';

import { useProfile } from '../Components/Hooks/UserHooks';
import { Message } from '../shared/const/message.const';
import { PATH_BY_ROLE, UserRole } from '../shared/const/user-role.const';

const AuthProtected = (props) => {
  const { userProfile, loading } = useProfile();
  const location = useLocation();
  const checkRoleViewPage = () => {
    switch (userProfile.group) {
      case UserRole.SUPER_ADMIN_GROUP:
        return true;
      case UserRole.CS:
        return PATH_BY_ROLE.CS.includes(location.pathname);
      case UserRole.SALE_ADMIN_SMS:
        return PATH_BY_ROLE.SALE_ADMIN_SMS.includes(location.pathname);
      case UserRole.KETOAN:
        return PATH_BY_ROLE.KETOAN.includes(location.pathname);
      case UserRole.SALEADMIN:
        return PATH_BY_ROLE.SALEADMIN.includes(location.pathname);
      case UserRole.SALE:
        return PATH_BY_ROLE.SALE.includes(location.pathname);
      case UserRole.CUSTOMER:
        return PATH_BY_ROLE.CUSTOMER.includes(location.pathname);
      case UserRole.ADMIN_USER:
        return PATH_BY_ROLE.ADMIN_USER.includes(location.pathname);
      case UserRole.NOC:
        return PATH_BY_ROLE.NOC.includes(location.pathname);
      default:
        return false;
    }
  };

  /*
    redirect is un-auth access protected routes via url
    */

  if (!userProfile && loading) {
    return (
      <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    );
  }

  if (!checkRoleViewPage()) {
    addToast({ message: Message.NOT_PERMISSION, type: 'error' });
    return (
      <Redirect
        to={{ pathname: '/home', state: { from: props.location } }}
      />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
