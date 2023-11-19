const routes = {
    HomeScreen: 'HomeScreen',
    LoginScreen: 'LoginScreen',
    SignupScreen: 'SignupScreen',
    ForgotPasswordScreen: 'ForgotPasswordScreen',
    ProfileScreen: 'ProfileScreen',
    ClothsScreen: 'ClothsScreen',
    CartScreen: 'CartScreen',
    PickupDropScreen: 'PickupDropScreen',
    AddressScreen: 'AddressScreen',
    OrdersScreen: 'OrdersScreen',
    ConfirmOrderScreen: 'ConfirmOrderScreen',
    OrderSuccessScreen: 'OrderSuccessScreen',
    OrdersScreen: 'OrdersScreen',
    OrderStatusScreen: 'OrderStatusScreen',
    MyAddressesScreen: 'MyAddressesScreen',
}

const api = {
    // baseUrl: 'http://192.168.98.132:5000',
    // 192.168.74.132
    // 192.168.43.132
    // baseUrl: 'http://192.168.164.132:5000',
    // 192.168.165.132
    baseUrl: 'http://192.168.43.132:5000',
    apiKey: 'c2964966ece452dba2b8d4c029c8d73',
    createUser: 'apis/create_user',
    users: 'apis/users',
    banners: 'apis/banners',
    services: 'apis/services',
    shops: 'apis/shops',
    products: 'apis/products',
    ordertiming: 'apis/ordertiming',
    addresses: 'apis/addresses',
    add_address: 'apis/add_address',
    remove_address: 'apis/remove_address',
    addorder: 'apis/add_order',
    orders: 'apis/orders'
}

const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];

export { routes, api, monthNames, dayNames };