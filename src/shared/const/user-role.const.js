export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  SALE: 'SALE',
  NOC: 'NOC',
  CS: 'CS',
  ADMIN_USER: 'ADMIN_USER',
  SUPER_ADMIN_GROUP: 'SUPER_ADMIN_GROUP',
  KETOAN: 'KETOAN',
  SALEADMIN: 'SALEADMIN',
  SALE_ADMIN_SMS: 'SALE_ADMIN_SMS',
  ITS_REPORT: 'ITS_REPORT',
};

export const PATH_BY_ROLE = {
  CS: [
    '/vendor',
    '/vendor-contact',
    '/vendor-package',
    '/number-owner',
    '/number-member',
    '/brand-management',
    '/report',
    '/totalreport',
    '/contract-management',
    '/home',
    '/change-password',
    '/sms-brand',
    '/sms-partner',
    '/sms-vendor',
    '/report-customer'
  ],
  ITS_REPORT: ['/home', '/report-detail', '/totalreport', '/change-password', '/report-customer', '/ticket-its', 'report-calltype', '/report-telco-calltype', '/user-management', '/report-detail-customer'],
  KETOAN: ['/home', '/report', '/totalreport', '/change-password', '/contract-management'],
  SALEADMIN: ['/home', '/change-password', '/contract-management', '/partner-management', '/brand-management', '/contact', 'report', '/totalreport'],
  SALE: ['/home', '/report', '/contract-management', '/change-password', '/partner-management', '/brand-management', '/contact', 'report', '/totalreport', '/ticket-its'],
  CUSTOMER: ['/home', '/report-customer', '/change-password', '/report-detail-customer'],
  NOC: [
    '/home',
    '/partner-management',
    '/change-password',
    '/service-config',
    '/service-packet'
  ],
  ADMIN_USER: [
    '/vendor',
    '/vendor-contact',
    '/vendor-package',
    '/number-owner',
    '/number-member',
    '/brand-management',
    '/report',
    '/totalreport',
    '/contract-management',
    '/ccu-total',
    '/home',
    '/change-password',
    '/report-customer',
    '/partner-management',
    '/contact',
    '/report-detail',
    '/inform-cdr'
  ],
  SALE_ADMIN_SMS: [
    '/home',
    '/change-password',
    '/sms-brand',
    '/sms-partner',
    '/sms-vendor',
    '/sms-statistic'
  ],
};
