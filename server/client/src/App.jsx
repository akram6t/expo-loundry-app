
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/index";
import AuthLayout from "./components/Layout/AuthLayout";
import GuestLayout from "./components/Layout/GuestLayout";
import Login from "./pages/auth/Login";
import { useNavigate } from "react-router-dom";
import Orders from './pages/orders/orders/index';
import { routes } from "./utils/Constant";
import OrderDetails from "./pages/orders/details";
import Customers from "./pages/customers";
import CustomerDetails from "./pages/customers/Details";
import Services from "./pages/services";
import ServicesTypes from "./pages/services/ServicesTypes";
import Addons from "./pages/addons";
import Expenses from "./pages/expenses";
import ExpensesCategory from "./pages/expenses_category";
import OrdersReport from "./pages/orders_report";
import SalesReport from "./pages/sales_report";
import ExpenseReport from "./pages/expense_report";
import ProfileSettings from "./pages/profile_settings";
import GeneralSettings from "./pages/general_settings";
import Media from "./pages/media";
import ApplicationSettings from "./pages/application_settings";
import TC from "./pages/term_and_conditions";
import OrdersStatus from "./pages/orders_status";
import OrderDateTime from "./pages/order_date_timing";
import ServicesCreate from "./pages/services_create";
import Banners from "./pages/banners";
import AppIndicator from "./components/Other/AppIndicator";
import Notifications from "./pages/notification";
import Messages from "./pages/messages";
import GetIp from "./utils/GetIp";
import CheckToken from "./utils/CheckIfLogin";


function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if(!authToken){
      setLoading(false);
      return;
    }
    GetIp().then(async(ip) => {
      CheckToken(authToken+ip).then(isToken => {
        if(isToken){
        setToken(true);
        setLoading(false);
      }else{
        setLoading(false);
        setToken(false);
      }
    });
    
  })
  }, []);

  if(loading){
    return <AppIndicator/>
  }

  return (
    <Routes>
      <Route path="/" element={token ? <AuthLayout /> : <Navigate to={routes.LOGIN} replace/>}>
        <Route path="/" element={ <Dashboard/> }></Route>
        <Route path={routes.ORDERS} element={<Orders />}></Route>
        <Route path={routes.CUSTOMERS} element={<Customers />}></Route>
        <Route path={routes.CUSTOMERS_CREATE} element={<CustomerDetails />}></Route>
        <Route path={routes.CUSTOMERS_EDIT} element={<CustomerDetails />}></Route>

        <Route path={routes.ORDER_DETAILS} element={<OrderDetails />}></Route>
        <Route path={routes.ORDER_CREATE} element={<OrderDetails />}></Route>

        <Route path={routes.SERVICES} element={<Services />}></Route>
        <Route path={routes.SERVICES_EDIT} element={<ServicesCreate />}></Route>
        <Route path={routes.SERVICES_CREATE} element={<ServicesCreate />}></Route>
        <Route path={routes.SERVICES_TYPE} element={<ServicesTypes />}></Route>
        <Route path={routes.ADDONS} element={<Addons />}></Route>

        <Route path={routes.EXPENSES} element={<Expenses />}></Route>
        <Route path={routes.EXPENSES_CATEGORY} element={<ExpensesCategory />}></Route>
        
        <Route path={routes.ORDERS_REPORT} element={<OrdersReport />}></Route>
        <Route path={routes.SALES_REPORT} element={<SalesReport />}></Route>
        <Route path={routes.EXPENSES_REPORT} element={<ExpenseReport />}></Route>
        
        <Route path={routes.APPLICATION_SETTINGS} element={<ApplicationSettings />}></Route>
        <Route path={routes.PROFILE_SETTINGS} element={<ProfileSettings />}></Route>
        <Route path={routes.GENERAL_SETTINGS} element={<GeneralSettings />}></Route>
        <Route path={routes.MEDIA} element={<Media />}></Route>
        
        <Route path={routes.TC} element={<TC />}></Route>
        <Route path={routes.BANNERS} element={<Banners />}></Route>
        <Route path={routes.ORDERS_STATUS} element={<OrdersStatus />}></Route>
        <Route path={routes.DATE_TIMING} element={<OrderDateTime />}></Route>
        
        <Route path={routes.NOTIFICATIONS} element={<Notifications />}></Route>
        <Route path={routes.MESSAGES} element={<Messages />}></Route>
        
        {/* <Route path="/404" element={<NotFound />}></Route> */}
        {/* <Route path="/form" element={<Form />}></Route> */}
        {/* <Route path="/profile" element={<Blank />}></Route> */}
      </Route>
      <Route path="/auth" element={<GuestLayout />}>
        <Route path="/auth/login" element={<Login setToken={token => setToken(token)} />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
