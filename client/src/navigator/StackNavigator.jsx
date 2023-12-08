import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from "../Constaints";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ClothsScreen from "../screens/ProductsScreen";
import CartScreen from "../screens/CartScreen";
import PickupDropScreen from "../screens/PickupDropScreen";
import AddressScreen from "../screens/AddressScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ConfirmOrderScreen from "../screens/ConfirmOrderScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import OrderStatusScreen from "../screens/OrderStatusScreen";
import MyAddressesScreen from "../screens/MyAddressesScreen";
import NotificationsScreen from '../screens/NotificationScreen';
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";
import SupportScreen from "../screens/SupportScreen";

const StackNavigator = () => {
    const Stack =  createNativeStackNavigator();

    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName={routes.HomeScreen}>
                {/* <Stack.Screen name={routes.LoginScreen} component={LoginScreen} options={{headerShown: false}} /> */}
                {/* <Stack.Screen name={routes.SignupScreen} component={SignupScreen} options={{headerShown: false}} /> */}
                {/* <Stack.Screen name={routes.ForgotPasswordScreen} component={ForgotPasswordScreen} options={{headerShown: false}} /> */}
                <Stack.Screen name={routes.HomeScreen} component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.ProfileScreen} component={ProfileScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.ClothsScreen} component={ClothsScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.CartScreen} component={CartScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.PickupDropScreen} component={PickupDropScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.AddressScreen} component={AddressScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.OrdersScreen} component={OrdersScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.ConfirmOrderScreen} component={ConfirmOrderScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.OrderSuccessScreen} component={OrderSuccessScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.OrderStatusScreen} component={OrderStatusScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.MyAddressesScreen} component={MyAddressesScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.TermsAndConditionsScreen} component={TermsAndConditionsScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.SupportScreen} component={SupportScreen} options={{headerShown: false}}/>
                <Stack.Screen name={routes.NotificationsScreen} component={NotificationsScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator;