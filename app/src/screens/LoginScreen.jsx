import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { routes } from '../Constaints';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import Loader from '../components/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from '../utils/reducers/DatabaseReducer';
import { database } from '../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { api } from '../Constaints';
import axios from 'axios';
import { getTokenforNotification } from '../utils/notification/getToken';

const LoginScreen = ({ navigation }) => {

    const theme = useTheme();
    const [ message, setMessage ] = useState('login successfully...');
    const [ snackbar, setSnackbar ] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const server = useSelector(state => state.path.path);

    const submitUpdateUser = (data) => {
        setLoading(true);
        axios.post(`${server.baseUrl}/${api.updateUser}`, {
          ...data
        }, {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
        .then((result, err) => {
          setLoading(false);
          const {status, message} = result.data;
          if(status){
            setMessage(message);
            setSnackbar(true);
          }
        }).catch(err => {
          setLoading(false);
          setMessage(`${err}`);
          setSnackbar(true);
          console.log(err);
        })
      }

    const onValueChange = (name, text) => {
        setUser({
            ...user,
            [name]: text,
        });
    }


    const handleOnLogin = async () => {
        if(user.email === '' || !user.email.includes('@gmail.com')){
            setMessage('email is empty or not email format ex. @gmail.com');
            setSnackbar(true);
            return;
        }
        if(user.password === '' || user.password.length < 6){
            setMessage('password length should be a atleast 6 charactor');
            setSnackbar(true);
            return;
        }

        setLoading(true);

        signInWithEmailAndPassword(auth, user.email.trim(), user.password.trim())
            .then((userCredential) => {
                // Signed in 
                const u = userCredential.user;

                Promise.all([saveData()]);

                function saveData (){

                getTokenforNotification().then(token => {
                    console.log(token);
                    const data = { uid: u.uid,
                        notificationToken: token,
                        password: user.password.trim()};
                        submitUpdateUser(data);
                        setLoading(false);
                        setMessage('login successfully...');
                        setSnackbar(true);
                });

            }
                // ...
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                setLoading(false);
                setMessage(errorMessage);
                if(errorMessage.includes('auth/invalid-login-credential') || errorMessage.includes('auth/invalid-credential') || errorMessage.includes('auth/user-not-found')){
                    setMessage('Invalid login credentials. Please check your email and password and try again.');
                }
                setSnackbar(true);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>

            <KeyboardAwareScrollView enableOnAndroid={true}>
                <View style={{ marginTop: 30, alignSelf: 'center', backgroundColor: '#f3f3f3', borderRadius: 100, padding: 15 }}>
                    <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_auth.png')} />
                </View>

                <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Login</Text>
                    <Text>Login to continue using app</Text>
                    <View style={{ marginTop: 20, gap: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Email</Text>
                        <TextInput textContentType='emailAddress'
                            onChangeText={(text) => onValueChange('email', text)} value={user.email}
                            // keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='email'
                            mode='outlined' theme={{ roundness: 100 }} contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} placeholder='Enter your email' />
                        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Password</Text>
                        <View style={{ position: 'relative' }}>

                            <MaterialCommunityIcons onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                                name={isPasswordSecure ? 'eye-off' : 'eye'}
                                size={30} style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 17,
                                    zIndex: 10
                                }} />

                            <TextInput
                                onChangeText={(text) => onValueChange('password', text)} value={user.password}
                                keyboardType='default'
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoCompleteType='password'
                                secureTextEntry={isPasswordSecure}
                                mode='outlined' theme={{ roundness: 100 }} contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} placeholder='Enter password' />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate(routes.ForgotPasswordScreen)} style={{ marginTop: 15 }}>
                        <Text style={{ fontWeight: 'bold', alignSelf: 'flex-end' }}>Forgot Password ?</Text>
                    </TouchableOpacity>
                    <Button mode='contained' onPress={() => handleOnLogin()} style={{ marginTop: 15 }} contentStyle={{ padding: 5 }}>Login</Button>
                </View>

                <Divider style={{ marginTop: 10, height: 2 }} />

                {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>login with</Text> */}

                {/* <View style={{ marginTop: 20, marginHorizontal: 20 }}> */}
                {/* <Button style={{ marginTop: 10, marginHorizontal: 20 }} mode='contained' theme={{ colors: { primary: 'white' }, roundness: 100 }} contentStyle={{ padding: 5 }} onPress={() => { }} icon={'google'}>Login With Google</Button> */}
                {/* </View> */}

                <TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={() => navigation.navigate(routes.SignupScreen)}>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Dont have an account?</Text>
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 }}>Register</Text>
                    </View>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

            <Loader loader={loading} setLoader={setLoading} />

            <Snackbar
                visible={snackbar}
                onDismiss={() => setSnackbar(false)}
                action={{
                    
                    label: 'X',
                    onPress: () => {
                        setSnackbar(false)
                    },
                }}>
                {message}
            </Snackbar>

        </SafeAreaView>
    )
}

export default LoginScreen