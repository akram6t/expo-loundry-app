import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from "../Constaints";
import LoginScreen from "./../screens/LoginScreen";
import SignupScreen from "./../screens/SignupScreen";
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

const StackNavigator = () => {
    const Stack =  createNativeStackNavigator();

    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName={routes.LoginScreen}>
                <Stack.Screen name={routes.LoginScreen} component={LoginScreen} options={{headerShown: false}} />
                <Stack.Screen name={routes.SignupScreen} component={SignupScreen} options={{headerShown: false}} />
                <Stack.Screen name={routes.ForgotPasswordScreen} component={ForgotPasswordScreen} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator;