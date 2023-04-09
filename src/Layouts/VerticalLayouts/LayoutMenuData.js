import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useProfile } from '../../Components/Hooks/UserHooks';
import { PATH_BY_ROLE, UserRole } from '../../shared/const/user-role.const';

const Navdata = () => {
  const { userProfile, loading } = useProfile();

  const handleMenuItems = (id) => {
    setNavMenu((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          item.stateVariables = !item.stateVariables;
        } else {
          item.stateVariables = false;
        }
        return item;
      })
    );
  };

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'homepage',
      label: 'DashBoard',
      icon: 'ri-home-2-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('homepage');
        updateIconSidebar(e);
      },
      stateVariables: true,
      subItems: [
        {
          id: 'home-page',
          label: 'Dashboard',
          link: '/home',
          parentId: 'homepage',
        },
      ],
    },
    {
      id: 'usermanagement',
      label: 'Quản lý người dùng',
      icon: 'ri-account-circle-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('usermanagement');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'user-management',
          label: 'Quản lý tài khoản',
          link: '/user-management',
          parentId: 'usermanagement',
        },
        {
          id: 'group-management',
          label: 'Quản lý nhóm',
          link: '/group-management',
          parentId: 'usermanagement',
        },
        {
          id: 'change-password',
          label: 'Đổi mật khẩu',
          link: '/change-password',
          parentId: 'usermanagement',
        },
      ],
    },
    {
      id: 'tables',
      label: 'Đối tác',
      icon: 'ri-community-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('tables');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'partner-management',
          label: 'Danh sách',
          link: '/partner-management',
          parentId: 'tables',
        },
        {
          id: 'contact',
          label: 'Liên hệ',
          link: '/contact',
          parentId: 'tables',
        },
      ],
    },

    {
      id: 'ticket',
      label: 'Quản lý Ticket',
      icon: 'ri-ticket-2-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('ticket');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'ticket-its',
          label: 'Ticket',
          link: '/ticket-its',
          parentId: 'ticket',
        },
      ],
    },
    {
      id: 'report',
      label: 'Thống kê Voice',
      icon: 'ri-line-chart-fill',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('report');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'reprot',
          label: 'Đối tác',
          link: '/report',
          parentId: 'report',
        },
        {
          id: 'totalreport',
          label: 'Doanh thu tổng',
          link: '/totalreport',
          parentId: 'report',
        },
      ],
    },

    {
      id: 'customerreport',
      label: 'Thống kê khách hàng',
      icon: 'ri-bar-chart-fill',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('customerreport');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'reprot-customer',
          label: 'Đối tác',
          link: '/report-customer',
          parentId: 'customerreport',
        },
      ],
    },
    {
      id: 'ccu',
      label: 'Giám sát',
      icon: 'ri-dashboard-2-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('ccu');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'ccu-total',
          label: 'CCU',
          link: '/ccu-total',
          parentId: 'ccu',
        },
        {
          id: 'log',
          label: 'Log',
          link: '/log',
          parentId: 'ccu',
        },
        // {
        //   id: 'ccu-datetime',
        //   label: 'Check CCU tổng theo thời gian',
        //   link: '/ccu-datetime',
        //   parentId: 'ccu',
        // },
      ],
    },
    {
      id: 'configmanagement',
      label: 'Hệ thống',
      icon: 'ri-settings-5-fill',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('configmanagement');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        // {
        //   id: 'account',
        //   label: 'Account',
        //   link: '/account',
        //   parentId: 'configmanagement',
        // },
        // {
        //   id: 'mapping',
        //   label: 'Mapping',
        //   link: '/mapping',
        //   parentId: 'configmanagement',
        // },
        // {
        //   id: 'routing',
        //   label: 'Routing',
        //   link: '/routing',
        //   parentId: 'configmanagement',
        // },
        // {
        //   id: 'partner-detail',
        //   label: 'Partner Detail',
        //   link: '/partner-detail',
        //   parentId: 'configmanagement',
        // },
        // {
        //   id: 'ip',
        //   label: 'Ip Customer',
        //   link: '/ip',
        //   parentId: 'configmanagement',
        // },
        {
          id: 'service-config',
          label: 'Service Config',
          link: '/service-config',
          parentId: 'configmanagement',
        },
        {
          id: 'service-packet',
          label: 'Service Packet',
          link: '/service-packet',
          parentId: 'configmanagement',
        },
      ],
    },
    // {
    //   id: 'pages',
    //   label: 'Alerts',
    //   icon: 'ri-alert-line',
    //   link: '/#',
    //   click: function (e) {
    //     e.preventDefault();
    //     handleMenuItems('pages');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: false,
    //   subItems: [
    //     {
    //       id: 'baocaocuocgoi',
    //       label: 'Total Call',
    //       link: '/baocaocuocgoi',
    //       parentId: 'pages',
    //     },
    //     {
    //       id: 'baocaocuocgoiloi',
    //       label: 'Total Call Fail',
    //       link: '/baocaocuocgoiloi',
    //       parentId: 'pages',
    //     },
    //   ],
    // },
  ];
  const [navMenu, setNavMenu] = useState(menuItems);

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul.querySelectorAll('.nav-icon.active');
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove('active');
        var id = item.getAttribute('subitems');
        if (document.getElementById(id))
          document.getElementById(id).classList.remove('show');
      });
    }
  }

  const filterByRole = (menu, role) => {
    menu.forEach((navItem) => {
      navItem.subItems = navItem.subItems?.filter((item) =>
        role.includes(item.link)
      );
    });

    setNavMenu(menu.filter((item) => !!item.subItems?.length || item.isHeader));
  };

  useEffect(() => {
    const cloneMenuItem = [...navMenu];

    switch (userProfile.group) {
      case UserRole.SUPER_ADMIN_GROUP:
        setNavMenu(menuItems);
        break;
      case UserRole.CS:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.CS);
        break;
      case UserRole.ADMIN_USER:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.ADMIN_USER);
        break;
      case UserRole.SALE_ADMIN_SMS:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.SALE_ADMIN_SMS);
        break;
      case UserRole.CUSTOMER:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.CUSTOMER);
        break;
      case UserRole.KETOAN:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.KETOAN);
        break;
      case UserRole.SALEADMIN:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.SALEADMIN);
        break;
      case UserRole.SALE:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.SALE);
        break;
      case UserRole.NOC:
        filterByRole(cloneMenuItem, PATH_BY_ROLE.NOC);
        break;
      default:
        setNavMenu([]);
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <React.Fragment>{navMenu}</React.Fragment>;
};
export default Navdata;
