import { routes } from "../utils/Constant";
 

const LINKING_DATA = () => {
    const Dashboard = {name: 'Dashboard', route: routes.DASHBOARD};
    
    const ORDERS_PAGE = [{...Dashboard}]

    const ORDERS_DETAILS_PAGE = [{...Dashboard}, {name: 'Orders', route: routes.ORDERS}]
    
    const CUSTOMER_PAGE = [{...Dashboard}]
    const CUSTOMER_DETAILS_PAGE = [{...Dashboard}, {name: 'Customers', route: routes.CUSTOMERS}]
    
    const SERVICES_PAGE = [{...Dashboard}]

    const ADDONS = [{...Dashboard}]

    const EXPENSES = [{...Dashboard}]
    
    const EXPENSES_CATEGORY = [{...Dashboard}, { name: 'Expenses', route: routes.EXPENSES }]
    
    const SERVICES_TYPE_PAGE = [{...Dashboard}, { name: 'Services', route: routes.SERVICES }]


    return{
        ORDERS_PAGE: ORDERS_PAGE,
        ORDERS_DETAILS_PAGE: ORDERS_DETAILS_PAGE,
        CUSTOMER_PAGE: CUSTOMER_PAGE,
        CUSTOMER_DETAILS_PAGE: CUSTOMER_DETAILS_PAGE,
        SERVICES_PAGE: SERVICES_PAGE, 
        SERVICES_TYPE_PAGE: SERVICES_TYPE_PAGE,
        ADDONS: ADDONS,
        EXPENSES: EXPENSES,
        EXPENSES_CATEGORY: EXPENSES_CATEGORY
    }
}

export default LINKING_DATA;