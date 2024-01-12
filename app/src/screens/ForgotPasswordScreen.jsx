import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, FAB, MD2Colors, Snackbar, TextInput, useTheme } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import Loader from '../components/Loader';

const ForgotPasswordScreen = ({navigation}) => {
    const [ email, setEmail ] = useState('');
    const theme = useTheme();
    const [ message, setMessage ] = useState('');
    const [ snackbar, setSnackbar ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const resetPassword = () => {
        setLoading(true);
        sendPasswordResetEmail(auth, email.trim()).then(() => {
            setEmail('');
            setLoading(false);
            setMessage('link send succussfully please check your mail !');
            setSnackbar(true);
            // navigation.goBack();
        }).catch(error => {
            const message = error.message;
            setLoading(false);
            if (message.includes('auth/invalid-email')) {
                setMessage('Error: The email address you entered is not valid. Please make sure you entered a correct email address in the format yourname@example.com.');
            } else if (message.includes('auth/user-not-found')) {
                setMessage('Error: This email is not associated with any user account. Please double-check the email you provided or sign up for a new account.');
            } else {
                setMessage('An error occurred while sending the password reset link. Please try again later.');
            }
            setSnackbar(true);
            console.log(error);
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
              <TouchableOpacity
                    style={{ position: 'absolute', left: 0, top: 30, alignSelf: 'baseline', backgroundColor: MD2Colors.grey300, marginStart: 10, marginTop: 10, padding: 8, borderRadius: 10, zIndex: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Entypo name="chevron-thin-left" size={24} />
                </TouchableOpacity>

                <ScrollView>

            <View style={{ marginTop: 30, alignSelf: 'center', backgroundColor: '#f3f3f3', borderRadius: 100, padding: 15 }}>
                <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_auth.png')} />
            </View>

            <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Forgot Password?</Text>
                <Text>Don't worry! it occurs. Please Enter the email address linked with your account.</Text>
                <View style={{ marginTop: 20, gap: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Email</Text>
                    <TextInput 
                        textContentType='emailAddress'
                        // keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='email'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        mode='outlined' theme={{ roundness: 100 }} contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} placeholder='Enter your email' />
                </View>
                {/* <TouchableOpacity onPress={() => {}} style={{ marginTop: 15 }}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'flex-end'}}>Forgot Password ?</Text>
                </TouchableOpacity> */}
                <Button mode='contained' onPress={() => resetPassword()} style={{ marginTop: 30 }} contentStyle={{padding: 5}}>Reset Password</Button>
            </View>


            </ScrollView>

            <Loader loader={loading} setLoader={setLoading}/>

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

export default ForgotPasswordScreen