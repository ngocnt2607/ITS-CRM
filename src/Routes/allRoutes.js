import React from 'react';
import { Redirect } from 'react-router-dom';

//Dashboard
import DashboardAnalytics from '../pages/DashboardAnalytics';
import DashboardCrm from '../pages/DashboardCrm';
import DashboardEcommerce from '../pages/DashboardEcommerce';

import DashboardCrypto from '../pages/DashboardCrypto';
import DashboardProject from '../pages/DashboardProject';

//Calendar
// Email box
import MailInbox from '../pages/EmailInbox';

//CHat
import Chat from '../pages/Chat';
import Calendar from '../pages/Calendar';

// Project
import ProjectList from '../pages/Projects/ProjectList';
import ProjectOverview from '../pages/Projects/ProjectOverview';
import CreateProject from '../pages/Projects/CreateProject';

//Task
import TaskDetails from '../pages/Tasks/TaskDetails';
import TaskList from '../pages/Tasks/TaskList';
import KanbanBoard from '../pages/Tasks/KanbanBoard/Index';

//Transactions
import Transactions from '../pages/Crypto/Transactions';
import BuySell from '../pages/Crypto/BuySell';
import CryproOrder from '../pages/Crypto/CryptoOrder';
import MyWallet from '../pages/Crypto/MyWallet';
import ICOList from '../pages/Crypto/ICOList';
import KYCVerification from '../pages/Crypto/KYCVerification';

//Crm Pages
import CrmCompanies from '../pages/Crm/CrmCompanies';
import CrmContacts from '../pages/Crm/CrmContacts';
import CrmDeals from '../pages/Crm/CrmDeals/index';
import CrmLeads from '../pages/Crm/CrmLeads/index';

//Invoices
import InvoiceList from '../pages/Invoices/InvoiceList';
import InvoiceCreate from '../pages/Invoices/InvoiceCreate';
import InvoiceDetails from '../pages/Invoices/InvoiceDetails';

// Support Tickets
import ListView from '../pages/SupportTickets/ListView';
import TicketsDetails from '../pages/SupportTickets/TicketsDetails';

// //Ecommerce Pages
import EcommerceProducts from '../pages/Ecommerce/EcommerceProducts/index';
import EcommerceProductDetail from '../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail';
import EcommerceAddProduct from '../pages/Ecommerce/EcommerceProducts/EcommerceAddProduct';
import EcommerceOrders from '../pages/Ecommerce/EcommerceOrders/index';
import EcommerceOrderDetail from '../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail';
import EcommerceCustomers from '../pages/Ecommerce/EcommerceCustomers/index';
import EcommerceCart from '../pages/Ecommerce/EcommerceCart';
import EcommerceCheckout from '../pages/Ecommerce/EcommerceCheckout';
import EcommerceSellers from '../pages/Ecommerce/EcommerceSellers/index';
import EcommerceSellerDetail from '../pages/Ecommerce/EcommerceSellers/EcommerceSellerDetail';

// Base Ui
import UiAlerts from '../pages/BaseUi/UiAlerts/UiAlerts';
import UiBadges from '../pages/BaseUi/UiBadges/UiBadges';
import UiButtons from '../pages/BaseUi/UiButtons/UiButtons';
import UiColors from '../pages/BaseUi/UiColors/UiColors';
import UiCards from '../pages/BaseUi/UiCards/UiCards';
import UiCarousel from '../pages/BaseUi/UiCarousel/UiCarousel';
import UiDropdowns from '../pages/BaseUi/UiDropdowns/UiDropdowns';
import UiGrid from '../pages/BaseUi/UiGrid/UiGrid';
import UiImages from '../pages/BaseUi/UiImages/UiImages';
import UiTabs from '../pages/BaseUi/UiTabs/UiTabs';
import UiAccordions from '../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse';
import UiModals from '../pages/BaseUi/UiModals/UiModals';
import UiOffcanvas from '../pages/BaseUi/UiOffcanvas/UiOffcanvas';
import UiPlaceholders from '../pages/BaseUi/UiPlaceholders/UiPlaceholders';
import UiProgress from '../pages/BaseUi/UiProgress/UiProgress';
import UiNotifications from '../pages/BaseUi/UiNotifications/UiNotifications';
import UiMediaobject from '../pages/BaseUi/UiMediaobject/UiMediaobject';
import UiEmbedVideo from '../pages/BaseUi/UiEmbedVideo/UiEmbedVideo';
import UiTypography from '../pages/BaseUi/UiTypography/UiTypography';
import UiList from '../pages/BaseUi/UiLists/UiLists';
import UiGeneral from '../pages/BaseUi/UiGeneral/UiGeneral';
import UiRibbons from '../pages/BaseUi/UiRibbons/UiRibbons';
import UiUtilities from '../pages/BaseUi/UiUtilities/UiUtilities';

// Advance Ui
import UiNestableList from '../pages/AdvanceUi/UiNestableList/UiNestableList';
import UiScrollbar from '../pages/AdvanceUi/UiScrollbar/UiScrollbar';
import UiAnimation from '../pages/AdvanceUi/UiAnimation/UiAnimation';
import UiTour from '../pages/AdvanceUi/UiTour/UiTour';
import UiSwiperSlider from '../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider';
import UiRatings from '../pages/AdvanceUi/UiRatings/UiRatings';
import UiHighlight from '../pages/AdvanceUi/UiHighlight/UiHighlight';

// Widgets
// import Widgets from '../pages/Widgets/Index';
// import BaoCaoCuocGoi from '../pages/Widgets/baocaocuocgoi/baocaocuocgoi.component';

//Forms
import BasicElements from '../pages/Forms/BasicElements/BasicElements';
import FormSelect from '../pages/Forms/FormSelect/FormSelect';
import FormEditor from '../pages/Forms/FormEditor/FormEditor';
import CheckBoxAndRadio from '../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio';
import Masks from '../pages/Forms/Masks/Masks';
import FileUpload from '../pages/Forms/FileUpload/FileUpload';
import FormPickers from '../pages/Forms/FormPickers/FormPickers';
import FormRangeSlider from '../pages/Forms/FormRangeSlider/FormRangeSlider';
import Formlayouts from '../pages/Forms/FormLayouts/Formlayouts';
import FormValidation from '../pages/Forms/FormValidation/FormValidation';
import FormWizard from '../pages/Forms/FormWizard/FormWizard';
import FormAdvanced from '../pages/Forms/FormAdvanced/FormAdvanced';

//Tables
// import BasicTables from '../pages/Tables/BasicTables/BasicTables';
// import GridTables from '../pages/Tables/GridTables/GridTables';
import SpamHotline from '../pages/Tables/spam-hotline/spam-hotline.component';
import PartnerListAll from '../pages/Tables/partner-management/partner-management.component';
import Mapping from '../pages/ConfigManagement/mapping/mapping.component';
import AccountList from '../pages/ConfigManagement/account/account.component';
import IpList from '../pages/Tables/ip/ip.component';
import RoutingList from '../pages/ConfigManagement/routing/routing.component';
import PartnerDetailList from '../pages/ConfigManagement/partner-detail/partner-detail.component';
import SipDetail from '../pages/Tables/sip-detail/sip-detail.component';
import ContactList from '../pages/Tables/contact/contact.component';

//Icon pages
import RemixIcons from '../pages/Icons/RemixIcons/RemixIcons';
import BoxIcons from '../pages/Icons/BoxIcons/BoxIcons';
import MaterialDesign from '../pages/Icons/MaterialDesign/MaterialDesign';
import FeatherIcons from '../pages/Icons/FeatherIcons/FeatherIcons';
import LineAwesomeIcons from '../pages/Icons/LineAwesomeIcons/LineAwesomeIcons';

//Maps
// import GoogleMaps from '../pages/Maps/GoogleMaps/GoogleMaps';
// import VectorMaps from '../pages/Maps/VectorMaps/VectorMaps';
// import LeafletMaps from '../pages/Maps/LeafletMaps/LeafletMaps';
import ReportVBN from '../pages/Maps/brand-name/vbn.component';
import Report from '../pages/Maps/report/report.component';
import TotalReport from '../pages/Maps/totalreport/totalreport.component';
import ReportCustomer from '../pages/CustomerReport/report-customer/report-customer.component';

//Homepage
import HomePage from '../pages/HomePage/home-page/home.component';

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import CoverSignUp from '../pages/AuthenticationInner/Register/CoverSignUp';
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';

//pages
// import Starter from '../pages/Pages/Starter/Starter';
// import SimplePage from '../pages/Pages/Profile/SimplePage/SimplePage';
// import Settings from '../pages/Pages/Profile/Settings/Settings';
// import Team from '../pages/Pages/Team/Team';
// import Timeline from '../pages/Pages/Timeline/Timeline';
// import Faqs from '../pages/Pages/Faqs/Faqs';
// import Pricing from '../pages/Pages/Pricing/Pricing';
// import Gallery from '../pages/Pages/Gallery/Gallery';
import Maintenance from '../pages/Pages/Maintenance/Maintenance';
import ComingSoon from '../pages/Pages/ComingSoon/ComingSoon';
// import SiteMap from '../pages/Pages/SiteMap/SiteMap';
// import SearchResults from '../pages/Pages/SearchResults/SearchResults';
import BaoCaoCuocGoi from '../pages/Pages/baocaocuocgoi/baocaocuocgoi.component';
import BaoCaoCuocGoiLoi from '../pages/Pages/baocaocuocgoiloi/baocaocuocgoiloi.component';

// Landing Index
import Index from '../pages/Landing';

import CoverPasswReset from '../pages/AuthenticationInner/PasswordReset/CoverPasswReset';
import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr';
import CoverLockScreen from '../pages/AuthenticationInner/LockScreen/CoverLockScr';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';
import CoverSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg';
import BasicTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify';
import CoverTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';

//login
import Login from '../pages/Authentication/Login';
import ForgetPasswordPage from '../pages/Authentication/ForgetPassword';
import Logout from '../pages/Authentication/Logout';
import Register from '../pages/Authentication/Register';

//Charts
import LineCharts from '../pages/Charts/ApexCharts/LineCharts';
import AreaCharts from '../pages/Charts/ApexCharts/AreaCharts';
import ColumnCharts from '../pages/Charts/ApexCharts/ColumnCharts';
import BarCharts from '../pages/Charts/ApexCharts/BarCharts';
import MixedCharts from '../pages/Charts/ApexCharts/MixedCharts';
import TimelineCharts from '../pages/Charts/ApexCharts/TimelineCharts';
import CandlestickChart from '../pages/Charts/ApexCharts/CandlestickChart';
import BoxplotCharts from '../pages/Charts/ApexCharts/BoxplotCharts';
import BubbleChart from '../pages/Charts/ApexCharts/BubbleChart';
import ScatterCharts from '../pages/Charts/ApexCharts/ScatterCharts';
import HeatmapCharts from '../pages/Charts/ApexCharts/HeatmapCharts';
import TreemapCharts from '../pages/Charts/ApexCharts/TreemapCharts';
import PieCharts from '../pages/Charts/ApexCharts/PieCharts';
import RadialbarCharts from '../pages/Charts/ApexCharts/RadialbarCharts';
import RadarCharts from '../pages/Charts/ApexCharts/RadarCharts';
import PolarCharts from '../pages/Charts/ApexCharts/PolarCharts';

import ChartsJs from '../pages/Charts/ChartsJs/index';
import Echarts from '../pages/Charts/ECharts/index';

//Quản lý số
import VendorList from '../pages/VendorManagement/vendor/vendor.component';
import VendorContactList from '../pages/VendorManagement/vendor-contact/vendor-contact.component';
import VendorPackageList from '../pages/NumberManagement/vendor-package/vendor-package.component';
import NumberOwnerList from '../pages/NumberManagement/number-owner/number-owner.component';
import NumberMemberList from '../pages/NumberManagement/number-member/number-member.component';

//Quản lý SMS
// import ReportSMSVendor from '../pages/SmsManagement/sms-vendor/sms-vendor.component';
// import ReportSMSPartner from '../pages/SmsManagement/sms-partner/sms-partner.component';
// import ReportSMSBrand from '../pages/SmsManagement/sms-brand/sms-brand.component';
// import ReportSMSStatistic from '../pages/SmsManagement/sms-statistic/sms-statistic.component';
// import SmsBrandList from '../pages/SmsBrand/sms-brandname/sms-brandname.component';
// import SmsAdvList from '../pages/SmsAdv/sms-adv/sms-adv.component';
// import SmsCustomerServiceAdvList from '../pages/SmsAdv/sms-customerservice/sms-customerservice.component';
// import SmsMessageTemplateAdvList from '../pages/SmsAdv/sms-adv-messagetemplate/sms-adv-messagetemplate.component';
// import SmsLogAdv from '../pages/SmsAdv/sms-adv-log/sms-adv-log.component';
// // Quản lý SMS Brand
// import SmsCustomerServiceBrandList from '../pages/SmsBrand/sms-customerservice-brand/sms-customerservice-brand.component';
// import SmsMessageTemplateBrandList from '../pages/SmsBrand/sms-brand-messagetemplate/sms-brand-messagetemplate.component';
// import SmsLogBrand from '../pages/SmsBrand/sms-brand-log/sms-brand-log.component';

//Quản lý khách hàng OTP
import OtpList from '../pages/SmsOtpConfig/opt-partner/otp-partner.component';

//Vendor_Sender
import VendorSenderList from '../pages/VendorManagement/vendor-sender/vendor-sender.component';

//Service-Config ông chú Khiên
import ServiceConfigList from '../pages/ConfigManagement/service-config/service-config.component';
import ServicePacketList from '../pages/ConfigManagement/service-packet/service-packet.component';

//Ticket
import TicketList from '../pages/Ticket/ticket-its/ticket.component';

//CCU
import CCUReport from '../pages/CCU/ccu-total/ccu.component';
import CCUTotal from '../pages/CCU/ccu-datetime/ccutime.component';
import Log from '../pages/CCU/log/log.component';

//Brandname management
import VbnList from '../pages/Brandname/brand-management/brand-management.component';

//UserManagement
import UserList from '../pages/UserManagement/user-management/user-management.component';
import GroupList from '../pages/UserManagement/group-management/group-management.component';
import ChangeList from '../pages/UserManagement/change-password/change-password.component';
//Contract Management
import ContractList from '../pages/ContractManagement/contract-management/contract-management.component';

const authProtectedRoutes = [
  { path: '/dashboard-analytics', component: DashboardAnalytics },
  { path: '/dashboard-crm', component: DashboardCrm },
  { path: '/dashboard', component: DashboardEcommerce },
  { path: '/dashboard-crypto', component: DashboardCrypto },
  { path: '/dashboard-projects', component: DashboardProject },
  { path: '/apps-calendar', component: Calendar },
  { path: '/apps-ecommerce-products', component: EcommerceProducts },
  {
    path: '/apps-ecommerce-product-details',
    component: EcommerceProductDetail,
  },
  { path: '/apps-ecommerce-add-product', component: EcommerceAddProduct },
  { path: '/apps-ecommerce-orders', component: EcommerceOrders },
  { path: '/apps-ecommerce-order-details', component: EcommerceOrderDetail },
  { path: '/apps-ecommerce-customers', component: EcommerceCustomers },
  { path: '/apps-ecommerce-cart', component: EcommerceCart },
  { path: '/apps-ecommerce-checkout', component: EcommerceCheckout },
  { path: '/apps-ecommerce-sellers', component: EcommerceSellers },
  { path: '/apps-ecommerce-seller-details', component: EcommerceSellerDetail },

  //Chat
  { path: '/apps-chat', component: Chat },

  //EMail
  { path: '/apps-mailbox', component: MailInbox },

  //Projects
  { path: '/apps-projects-list', component: ProjectList },
  { path: '/apps-projects-overview', component: ProjectOverview },
  { path: '/apps-projects-create', component: CreateProject },

  //Task
  { path: '/apps-tasks-list-view', component: TaskList },
  { path: '/apps-tasks-details', component: TaskDetails },
  { path: '/apps-tasks-kanban', component: KanbanBoard },
  //Crm
  { path: '/apps-crm-contacts', component: CrmContacts },
  { path: '/apps-crm-companies', component: CrmCompanies },
  { path: '/apps-crm-deals', component: CrmDeals },
  { path: '/apps-crm-leads', component: CrmLeads },

  //Invoices
  { path: '/apps-invoices-list', component: InvoiceList },
  { path: '/apps-invoices-details', component: InvoiceDetails },
  { path: '/apps-invoices-create', component: InvoiceCreate },

  //Supports Tickets
  { path: '/apps-tickets-list', component: ListView },
  { path: '/apps-tickets-details', component: TicketsDetails },

  //transactions
  { path: '/apps-crypto-transactions', component: Transactions },
  { path: '/apps-crypto-buy-sell', component: BuySell },
  { path: '/apps-crypto-orders', component: CryproOrder },
  { path: '/apps-crypto-wallet', component: MyWallet },
  { path: '/apps-crypto-ico', component: ICOList },
  { path: '/apps-crypto-kyc', component: KYCVerification },

  //charts
  { path: '/charts-apex-line', component: LineCharts },
  { path: '/charts-apex-area', component: AreaCharts },
  { path: '/charts-apex-column', component: ColumnCharts },
  { path: '/charts-apex-bar', component: BarCharts },
  { path: '/charts-apex-mixed', component: MixedCharts },
  { path: '/charts-apex-timeline', component: TimelineCharts },
  { path: '/charts-apex-candlestick', component: CandlestickChart },
  { path: '/charts-apex-boxplot', component: BoxplotCharts },
  { path: '/charts-apex-bubble', component: BubbleChart },
  { path: '/charts-apex-scatter', component: ScatterCharts },
  { path: '/charts-apex-heatmap', component: HeatmapCharts },
  { path: '/charts-apex-treemap', component: TreemapCharts },
  { path: '/charts-apex-pie', component: PieCharts },
  { path: '/charts-apex-radialbar', component: RadialbarCharts },
  { path: '/charts-apex-radar', component: RadarCharts },
  { path: '/charts-apex-polar', component: PolarCharts },

  { path: '/charts-chartjs', component: ChartsJs },
  { path: '/charts-echarts', component: Echarts },

  // Base Ui
  { path: '/ui-alerts', component: UiAlerts },
  { path: '/ui-badges', component: UiBadges },
  { path: '/ui-buttons', component: UiButtons },
  { path: '/ui-colors', component: UiColors },
  { path: '/ui-cards', component: UiCards },
  { path: '/ui-carousel', component: UiCarousel },
  { path: '/ui-dropdowns', component: UiDropdowns },
  { path: '/ui-grid', component: UiGrid },
  { path: '/ui-images', component: UiImages },
  { path: '/ui-tabs', component: UiTabs },
  { path: '/ui-accordions', component: UiAccordions },
  { path: '/ui-modals', component: UiModals },
  { path: '/ui-offcanvas', component: UiOffcanvas },
  { path: '/ui-placeholders', component: UiPlaceholders },
  { path: '/ui-progress', component: UiProgress },
  { path: '/ui-notifications', component: UiNotifications },
  { path: '/ui-media', component: UiMediaobject },
  { path: '/ui-embed-video', component: UiEmbedVideo },
  { path: '/ui-typography', component: UiTypography },
  { path: '/ui-lists', component: UiList },
  { path: '/ui-general', component: UiGeneral },
  { path: '/ui-ribbons', component: UiRibbons },
  { path: '/ui-utilities', component: UiUtilities },

  // Advance Ui
  { path: '/advance-ui-nestable', component: UiNestableList },
  { path: '/advance-ui-scrollbar', component: UiScrollbar },
  { path: '/advance-ui-animation', component: UiAnimation },
  { path: '/advance-ui-tour', component: UiTour },
  { path: '/advance-ui-swiper', component: UiSwiperSlider },
  { path: '/advance-ui-ratings', component: UiRatings },
  { path: '/advance-ui-highlight', component: UiHighlight },

  // Widgets
  // { path: '/widgets', component: Widgets },
  // Forms
  { path: '/forms-elements', component: BasicElements },
  { path: '/forms-select', component: FormSelect },
  { path: '/forms-editors', component: FormEditor },
  { path: '/forms-checkboxes-radios', component: CheckBoxAndRadio },
  { path: '/forms-masks', component: Masks },
  { path: '/forms-file-uploads', component: FileUpload },
  { path: '/forms-pickers', component: FormPickers },
  { path: '/forms-range-sliders', component: FormRangeSlider },
  { path: '/forms-layouts', component: Formlayouts },
  { path: '/forms-validation', component: FormValidation },
  { path: '/forms-wizard', component: FormWizard },
  { path: '/forms-advanced', component: FormAdvanced },

  //Tables
  // { path: '/tables-basic', component: BasicTables },
  // { path: '/tables-gridjs', component: GridTables },
  { path: '/user-list', component: UserList },
  { path: '/spam-hotline', component: SpamHotline },
  { path: '/partner-management', component: PartnerListAll },
  { path: '/mapping', component: Mapping },
  { path: '/account', component: AccountList },
  { path: '/ip', component: IpList },
  { path: '/routing', component: RoutingList },
  { path: '/partner-detail', component: PartnerDetailList },
  { path: '/report', component: Report },
  { path: '/sip-detail', component: SipDetail },
  { path: '/contact', component: ContactList },
  { path: '/service-config', component: ServiceConfigList },
  { path: '/service-packet', component: ServicePacketList },

  //Icons
  { path: '/icons-remix', component: RemixIcons },
  { path: '/icons-boxicons', component: BoxIcons },
  { path: '/icons-materialdesign', component: MaterialDesign },
  { path: '/icons-feather', component: FeatherIcons },
  { path: '/icons-lineawesome', component: LineAwesomeIcons },

  //Maps
  // { path: '/maps-google', component: GoogleMaps },
  // { path: '/maps-vector', component: VectorMaps },
  // { path: '/maps-leaflet', component: LeafletMaps },
  { path: '/brand-name', component: ReportVBN },
  { path: '/report', component: Report },
  { path: '/totalreport', component: TotalReport },
  { path: '/report-customer', component: ReportCustomer },

  //NumberManagement
  { path: '/vendor', component: VendorList },
  { path: '/vendor-contact', component: VendorContactList },
  { path: '/vendor-package', component: VendorPackageList },
  { path: '/number-owner', component: NumberOwnerList },
  { path: '/number-member', component: NumberMemberList },

  //Quản lý Vendor Sender
  { path: '/vendor-sender', component: VendorSenderList },

  //Quản lý SMS
  // { path: '/sms-vendor', component: ReportSMSVendor },
  // { path: '/sms-partner', component: ReportSMSPartner },
  // { path: '/sms-brand', component: ReportSMSBrand },
  // { path: '/sms-statistic', component: ReportSMSStatistic },
  // { path: '/sms-brandname', component: SmsBrandList },
  // { path: '/sms-adv', component: SmsAdvList },
  // { path: '/sms-customerservice', component: SmsCustomerServiceAdvList },
  // { path: '/sms-adv-messagetemplate', component: SmsMessageTemplateAdvList },
  // { path: '/sms-adv-log', component: SmsLogAdv },
  // //Quản lý SMS Brand
  // { path: '/sms-customerservice-brand', component: SmsCustomerServiceBrandList },
  // { path: '/sms-brand-messagetemplate', component: SmsMessageTemplateBrandList },
  // { path: '/sms-brand-log', component: SmsLogBrand },

  //Quản lý khách hàng OTP
  // { path: '/otp-partner', component: OtpList },

  //CCU
  { path: '/ccu-total', component: CCUReport },
  { path: '/ccu-datetime', component: CCUTotal },
  { path: '/log', component: Log },

  //Brand management
  { path: '/brand-management', component: VbnList },

  //Ticket
  { path: '/ticket-its', component: TicketList },

  //UserManagement
  { path: '/user-management', component: UserList },
  { path: '/group-management', component: GroupList },
  { path: '/change-password', component: ChangeList },

  //Contract Management
  { path: '/contract-management', component: ContractList },

  { path: '/home', component: HomePage },

  //Pages
  // { path: '/pages-starter', component: Starter },
  // { path: '/pages-profile', component: SimplePage },
  // { path: '/pages-profile-settings', component: Settings },
  // { path: '/pages-team', component: Team },
  // { path: '/pages-timeline', component: Timeline },
  // { path: '/pages-faqs', component: Faqs },
  // { path: '/pages-gallery', component: Gallery },
  // { path: '/pages-pricing', component: Pricing },
  // { path: '/pages-sitemap', component: SiteMap },
  // { path: '/pages-search-results', component: SearchResults },
  { path: '/baocaocuocgoi', component: BaoCaoCuocGoi },
  { path: '/baocaocuocgoiloi', component: BaoCaoCuocGoiLoi },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/home' />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: '/logout', component: Logout },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgetPasswordPage },
  { path: '/register', component: Register },

  //AuthenticationInner pages
  { path: '/auth-signin-basic', component: BasicSignIn },
  { path: '/auth-signin-cover', component: CoverSignIn },
  { path: '/auth-signup-basic', component: BasicSignUp },
  { path: '/auth-signup-cover', component: CoverSignUp },
  { path: '/auth-pass-reset-basic', component: BasicPasswReset },
  { path: '/auth-pass-reset-cover', component: CoverPasswReset },
  { path: '/auth-lockscreen-basic', component: BasicLockScreen },
  { path: '/auth-lockscreen-cover', component: CoverLockScreen },
  { path: '/auth-logout-basic', component: BasicLogout },
  { path: '/auth-logout-cover', component: CoverLogout },
  { path: '/auth-success-msg-basic', component: BasicSuccessMsg },
  { path: '/auth-success-msg-cover', component: CoverSuccessMsg },
  { path: '/auth-twostep-basic', component: BasicTwosVerify },
  { path: '/auth-twostep-cover', component: CoverTwosVerify },
  { path: '/auth-404-basic', component: Basic404 },
  { path: '/auth-404-cover', component: Cover404 },
  { path: '/auth-404-alt', component: Alt404 },
  { path: '/auth-500', component: Error500 },
  { path: '/pages-maintenance', component: Maintenance },
  { path: '/pages-coming-soon', component: ComingSoon },
  { path: '/landing', component: Index },
];

export { authProtectedRoutes, publicRoutes };
