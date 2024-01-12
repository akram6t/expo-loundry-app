import { faApper, faMedapps, faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import {
  faHouse,
  faTag,
  faList,
  faUser,
  faGear,
  faImage,
  faChartPie,
  faChartLine,
  faFile,
  faBox,
  faPuzzlePiece,
  faSquarePlus,
  faBook,
  faSignal,
  faTimeline,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "../utils/Constant";

const initMenu = [
  {
    label: "Dashboard",
    path: routes.DASHBOARD,
    icon: faHouse,
  },
  {
    label: "Orders",
  },
  {
    label: "Orders",
    path: routes.ORDERS,
    icon: faBox,
  },
  // {
  //   label: "Create Order",
  //   path: routes.ORDER_CREATE,
  //   icon: faSquarePlus,
  // },
  {
    label: "Customers",
  },
  {
    label: "Customers",
    path: routes.CUSTOMERS,
    icon: faUser,
  },
  {
    label: 'Services'
  },
  {
    label: "All Services",
    path: routes.SERVICES,
    icon: faList,
  },
  {
    label: "Services Types",
    path: routes.SERVICES_TYPE,
    icon: faTag,
  },
  {
    label: "Addons",
    path: routes.ADDONS,
    icon: faPuzzlePiece,
  },
  {
    label: 'Expenses'
  },
  {
    label: "Expense List",
    path: routes.EXPENSES,
    icon: faList,
  },
  {
    label: "Expense Category",
    path: routes.EXPENSES_CATEGORY,
    icon: faTag,
  },
  {
    label: 'Reports'
  },
  {
    label: "Orders Report",
    path: routes.ORDERS_REPORT,
    icon: faChartLine,
  },
  {
    label: "Sales Report",
    path: routes.SALES_REPORT,
    icon: faChartPie,
  },
  {
    label: "Expense Report",
    path: routes.EXPENSES_REPORT,
    icon: faFile,
  },
  // {
  //   label: 'Delivery Partner'
  // },
  // {
  //   label: "Delivery Partner",
  //   path: routes.APPLICATION_SETTINGS,
  //   icon: faMedapps,
  // },
  {
    label: 'Settings'
  },
  {
    label: "Media",
    path: routes.MEDIA,
    icon: faImage,
  },
  // {
    // label: "Application Settings",
    // path: routes.APPLICATION_SETTINGS,
    // icon: faMedapps,
  // },
  {
    label: "General Settings",
    path: routes.GENERAL_SETTINGS,
    icon: faGear,
  },
  {
    label: "Profile Settings",
    path: routes.PROFILE_SETTINGS,
    icon: faUser,
  },
  {
    label: "Others",
  },
  {
    label: "Date & Timing",
    path: routes.DATE_TIMING,
    icon: faTimeline,
  },
  {
    label: "Orders Status",
    path: routes.ORDERS_STATUS,
    icon: faSignal,
  },
  {
    label: "Banners",
    path: routes.BANNERS,
    icon: faBars,
  },
  {
    label: "Term & Conditions",
    path: routes.TC,
    icon: faBook,
  },
];

export default initMenu