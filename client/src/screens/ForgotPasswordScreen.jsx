import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, FAB, MD2Colors, TextInput, useTheme } from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import { routes } from '../../Constaints';
import { Entypo } from '@expo/vector-icons';

const ForgotPasswordScreen = ({navigation}) => {
    const theme = useTheme();
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
                    <TextInput textContentType='emailAddress'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='email'
                        mode='outlined' theme={{ roundness: 100 }} contentStyle={{ backgroundColor: '#f3f3f3', borderRadius: 100, paddingHorizontal: 15 }} placeholder='enter your email' />
                </View>
                {/* <TouchableOpacity onPress={() => {}} style={{ marginTop: 15 }}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'flex-end'}}>Forgot Password ?</Text>
                </TouchableOpacity> */}
                <Button mode='contained' onPress={() => navigation.navigate(routes.HomeScreen)} style={{ marginTop: 30 }} contentStyle={{padding: 5}}>Reset Password</Button>
            </View>

            {/* <Divider style={{marginTop: 10, height: 2}}/> */}

            {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>login with</Text> */}

            {/* <View style={{ marginTop: 20, marginHorizontal: 20 }}> */}
                {/* <Button style={{marginTop: 10, marginHorizontal: 20}} mode='contained' theme={{colors:{primary: 'white'}, roundness: 100}} contentStyle={{padding: 5}} onPress={() => {}} icon={'google'}>Login With Google</Button> */}
            {/* </View> */}

            {/* <TouchableOpacity style={{marginTop: 20, alignSelf: 'center'}} onPress={() => {}}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={{fontWeight: 'bold'}}>go to</Text>
                <Text style={{color: theme.colors.primary, fontWeight: 'bold', fontSize: 16}}>login screen</Text>
                </View>
            </TouchableOpacity> */}

            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPasswordScreen