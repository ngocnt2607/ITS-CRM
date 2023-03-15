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
        // {
        //   id: 'user-list',
        //   label: 'User List',
        //   link: '/user-list',
        //   parentId: 'tables',
        // },
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
        // {
        //   id: 'spam-hotline',
        //   label: 'Quản lý spam',
        //   link: '/spam-hotline',
        //   parentId: 'tables',
        // },
        // {
        //   id: 'sip-detail',
        //   label: 'SipDetail',
        //   link: '/sip-detail',
        //   parentId: 'tables',
        // },
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
      id: 'vendormanagement',
      label: 'Nhà cung cấp',
      icon: 'ri-briefcase-4-fill',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('vendormanagement');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'vendor',
          label: 'Danh sách',
          link: '/vendor',
          parentId: 'vendormanagement',
        },
        {
          id: 'vendor-contact',
          label: 'Liên hệ',
          link: '/vendor-contact',
          parentId: 'vendormanagement',
        },
        // {
        //   id: 'vendor-sender',
        //   label: 'Danh sách giá Vendor',
        //   link: '/vendor-sender',
        //   parentId: 'vendormanagement',
        // },
      ],
    },

    {
      id: 'numbermanagement',
      label: 'Số',
      icon: 'ri-contacts-book-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('numbermanagement');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        // {
        //   id: 'vendor',
        //   label: 'Nhà cung cấp',
        //   link: '/vendor',
        //   parentId: 'numbermanagement',
        // },
        // {
        //   id: 'vendor-contact',
        //   label: 'Liên hệ',
        //   link: '/vendor-contact',
        //   parentId: 'numbermanagement',
        // },
        {
          id: 'vendor-package',
          label: 'Gói',
          link: '/vendor-package',
          parentId: 'numbermanagement',
        },
        {
          id: 'number-owner',
          label: 'Số chủ',
          link: '/number-owner',
          parentId: 'numbermanagement',
        },
        {
          id: 'number-member',
          label: 'Số thành viên',
          link: '/number-member',
          parentId: 'numbermanagement',
        },
      ],
    },
    {
      id: 'brandname',
      label: 'Định danh',
      icon: 'ri-file-mark-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('brandname');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'brand-management',
          label: 'Danh sách',
          link: '/brand-management',
          parentId: 'Brandname',
        },
      ],
    },
    {
      id: 'contractmanagement',
      label: 'Hợp đồng',
      icon: 'ri-file-list-3-line',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        handleMenuItems('contractmanagement');
        updateIconSidebar(e);
      },
      stateVariables: false,
      subItems: [
        {
          id: 'contract-management',
          label: 'Danh sách',
          link: '/contract-management',
          parentId: 'ContractManagement',
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
        // {
        //   id: 'brand-name',
        //   label: 'Report VBN',
        //   link: '/brand-name',
        //   parentId: 'report',
        // },
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

    // {
    //   id: 'smsmanagement',
    //   label: 'Thống kê SMS',
    //   icon: 'ri-inbox-fill',
    //   link: '/#',
    //   click: function (e) {
    //     e.preventDefault();
    //     handleMenuItems('smsmanagement');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: false,
    //   subItems: [
    //     {
    //       id: 'sms-vendor',
    //       label: 'Thống kê Vendor',
    //       link: '/sms-vendor',
    //       parentId: 'smsmanagement',
    //     },
    //     {
    //       id: 'sms-partner',
    //       label: 'Thống kê Partner',
    //       link: '/sms-partner',
    //       parentId: 'smsmanagement',
    //     },
    //     {
    //       id: 'sms-brand',
    //       label: 'Thống kê Brand',
    //       link: '/sms-brand',
    //       parentId: 'smsmanagement',
    //     },
    //     {
    //       id: 'sms-statistic',
    //       label: 'Thống kê Nội Dung',
    //       link: '/sms-statistic',
    //       parentId: 'smsmanagement',
    //     },
    //   ],
    // },

    // {
    //   id: 'smsotpconfig',
    //   label: 'Quản lý SMS OTP',
    //   icon: 'ri-tools-fill',
    //   link: '/#',
    //   click: function (e) {
    //     e.preventDefault();
    //     handleMenuItems('smsotpconfig');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: false,
    //   subItems: [
    //     {
    //       id: 'otp-partner',
    //       label: 'OTP-Partner',
    //       link: '/otp-partner',
    //       parentId: 'smsotpconfig',
    //     },
    //   ],
    // },

    // {
    //   id: 'smsbrand',
    //   label: 'Quản lý SMS Brandname',
    //   icon: 'ri-exchange-box-line',
    //   link: '/#',
    //   click: function (e) {
    //     e.preventDefault();
    //     handleMenuItems('smsbrand');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: false,
    //   subItems: [
    //     {
    //       id: 'sms-brandname',
    //       label: 'SMS Brandname',
    //       link: '/sms-brandname',
    //       parentId: 'smsbrand',
    //     },
    //     {
    //       id: 'sms-customerservice-brand',
    //       label: 'Customer Service Brand',
    //       link: '/sms-customerservice-brand',
    //       parentId: 'smsbrand',
    //     },
    //     {
    //       id: 'sms-brand-messagetemplate',
    //       label: 'Message Template Brand',
    //       link: '/sms-brand-messagetemplate',
    //       parentId: 'smsbrand',
    //     },
    //     {
    //       id: 'sms-brand-log',
    //       label: 'SMS Brand Log',
    //       link: '/sms-brand-log',
    //       parentId: 'smsbrand',
    //     },
    //   ],
    // },

    // {
    //   id: 'smsadv',
    //   label: 'Quản lý SMS Adv',
    //   icon: 'ri-exchange-box-line',
    //   link: '/#',
    //   click: function (e) {
    //     e.preventDefault();
    //     handleMenuItems('smsadv');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: false,
    //   subItems: [
    //     {
    //       id: 'sms-adv',
    //       label: 'SMS Adv',
    //       link: '/sms-adv',
    //       parentId: 'smsadv',
    //     },
    //     {
    //       id: 'sms-customerservice',
    //       label: 'Customer Service',
    //       link: '/sms-customerservice',
    //       parentId: 'smsadv',
    //     },
    //     {
    //       id: 'sms-adv-messagetemplate',
    //       label: 'Message Template',
    //       link: '/sms-adv-messagetemplate',
    //       parentId: 'smsadv',
    //     },
    //     {
    //       id: 'sms-adv-log',
    //       label: 'SMS Log',
    //       link: '/sms-adv-log',
    //       parentId: 'smsadv',
    //     },
    //   ],
    // },

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
