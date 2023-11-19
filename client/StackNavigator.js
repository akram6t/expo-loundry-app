import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from "./Constaints";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ClothsScreen from "./src/screens/ClothsScreen";
import CartScreen from "./src/screens/CartScreen";
import PickupDropScreen from "./src/screens/PickupDropScreen";
import AddressScreen from "./src/screens/AddressScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ConfirmOrderScreen from "./src/screens/ConfirmOrderScreen";
import OrderSuccessScreen from "./src/screens/OrderSuccessScreen";
import OrderStatusScreen from "./src/screens/OrderStatusScreen";
import MyAddressesScreen from "./src/screens/MyAddressesScreen";
import NotificationsScreen from './src/screens/NotificationScreen';

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
                <Stack.Screen name={routes.NotificationsScreen} component={NotificationsScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator;