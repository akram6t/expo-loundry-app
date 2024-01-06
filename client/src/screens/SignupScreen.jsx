import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Snackbar, FAB, MD2Colors, TextInput, useTheme } from 'react-native-paper';
import { routes, api } from '../Constaints';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Loader from '../components/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getTokenforNotification } from '../utils/notification/getToken';

const SignupScreen = ({ navigation }) => {
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [message, setMessage ] = useState('');
    const theme = useTheme();
    const server = useSelector(state => state.path.path);
    // console.log(server.baseUrl);
    // const dispatch = useDispatch();
    // const authState = useSelector(state => state.auth.userCreated)
    const [user, setUser] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
    });

    const onValueChange = (name, text) => {
        if(name === 'mobile'){
            if(text.length > 10){
                return;
            }
        }
        if(name === 'name'){
            if(text.length > 20){
                return;
            }
        }
        setUser({
            ...user,
            [name]: text,
        });

    }

    const handleOnSubmit = () => {

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

        if(user.name === ''){
            setMessage('name length should be a atleast 6 charactor');
            setSnackbar(true);
            return;
        }

        if(user.mobile === '' || user.mobile.length < 10){
            setMessage('mobile number length should be a atleast 10 charactor');
            setSnackbar(true);
            return;
        }

        setLoading(true);

        // dispatch(isCreated(false));


        createUserWithEmailAndPassword(auth, user.email.trim(), user.password.trim())
            .then((userCredential) => {

                getTokenforNotification().then(token => {
                // Signed up 
                const currentUser = userCredential.user;
                axios.post(`${server.baseUrl}/${api.createUser}`,
                    {
                        uid: currentUser.uid, 
                        name: user.name.trim(), 
                        email:user.email.trim(), 
                        mobile: user.mobile.trim(),
                        notificationToken: token,
                        password: user.password.trim()
                    }, 
                    {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
                .then(response => {
                    const { status } = response.data;
                    if(status){
                        setMessage('user create successfully...');
                        setLoading(false);
                        setSnackbar(true);
                        console.log('user created successfully...');
                    }


                }).catch(err => {
                    console.log(err);
                    setMessage(err);
                    setLoading(false);
                    setSnackbar(true);
                })

            })
                
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                setMessage(errorMessage);
                if(errorMessage.includes('email-already-in-use')){
                    setMessage('This email is already in use. If you already have an account, please try signing in.');
                }
                setSnackbar(true);
                setLoading(false);
                // ..
            });
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, position: 'relative' }}>
            <TouchableOpacity
                style={{ position: 'absolute', left: 0, top: 30, alignSelf: 'baseline', backgroundColor: MD2Colors.grey300, marginStart: 10, marginTop: 10, padding: 8, borderRadius: 10, zIndex: 10 }}
                onPress={() => navigation.goBack()}
            >
                <Entypo name="chevron-thin-left" size={24} />
            </TouchableOpacity>

            <KeyboardAwareScrollView enableOnAndroid={true}>

                <View style={{ marginTop: 10, alignSelf: 'center', backgroundColor: '#f3f3f3', borderRadius: 100, padding: 15 }}>
                    <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_auth.png')} />
                </View>

                <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Signup</Text>
                    <Text>Enter your personal information</Text>
                    <View style={{ marginTop: 20, gap: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Name</Text>
                        <TextInput onChangeText={(text) => onValueChange('name', text)} value={user.name}
                            mode='outlined' theme={{ roundness: 100 }} 
                            contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} 
                            placeholder='Enter your name' />
                        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Email</Text>
                        <TextInput onChangeText={(text) => onValueChange('email', text)} value={user.email}
                            textContentType='emailAddress'
                            // keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='email'
                            mode='outlined' 
                            theme={{ roundness: 100 }} 
                            contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} 
                            placeholder='Enter your email' />
                        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Mobile</Text>
                        <View style={{position: 'relative'}}>
                            <Text style={{position: 'absolute', top: 21.5, left: 10, zIndex: 5, fontSize: 16}}>+91</Text>
                        <TextInput onChangeText={(text) => onValueChange('mobile', text)} value={user.mobile}
                            keyboardType='number-pad'
                            autoCapitalize='none'
                            autoCorrect={false}
                            mode='outlined' theme={{ roundness: 100 }}
                            contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15, paddingStart: 45 }}
                            placeholder='Enter mobile' />
                        </View>

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
                                mode='outlined' theme={{ roundness: 100 }}
                                contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }}
                                placeholder='Enter password' />
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={() => {}} style={{ marginTop: 15 }}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'flex-end'}}>Forgot Password ?</Text>
                </TouchableOpacity> */}
                    <Button mode='contained' onPress={() => handleOnSubmit()} style={{ marginTop: 15 }} contentStyle={{ padding: 5 }}>Create Account</Button>
                </View>

                {/* <Divider style={{marginTop: 10, height: 2}}/> */}

                {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>login with</Text> */}

                {/* <View style={{ marginTop: 20, marginHorizontal: 20 }}> */}
                {/* <Button style={{marginTop: 10, marginHorizontal: 20}} mode='contained' theme={{colors:{primary: 'white'}, roundness: 100}} contentStyle={{padding: 5}} onPress={() => {}} icon={'google'}>Login With Google</Button> */}
                {/* </View> */}
                {/* 
            <TouchableOpacity style={{marginTop: 20, alignSelf: 'center'}} onPress={() => {}}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={{fontWeight: 'bold'}}>Dont have an account?</Text>
                <Text style={{color: theme.colors.primary, fontWeight: 'bold', fontSize: 16}}>Register</Text>
                </View>
            </TouchableOpacity> */}

            </KeyboardAwareScrollView>

            
            <Loader loader={loading} setLoader={setLoading} />

            <Snackbar
                visible={snackbar}
                onDismiss={() => setSnackbar(false)}
                action={{
                    
                    label: 'x',
                    onPress: () => {
                        setSnackbar(false)
                    },
                }}>
                {message}
            </Snackbar>

        </SafeAreaView>
    )
}

export default SignupScreen