import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { useTheme, Snackbar, MD2Colors, Button, Title, TouchableRipple, TextInput } from 'react-native-paper'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { api } from '../Constaints'
import Loader from '../components/Loader'
import * as Linking from 'expo-linking';

const SupportScreen = ({ navigation }) => {
    const theme = useTheme();
    const [message, setMessage] = useState();
    const [loader, setLoader] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [ shop, setShop ] = useState(null);

    const [ query, setQuery ] = useState('');
    const [ isSupportOpen, setIsSupportOpen ] = useState(false); 

    const server = useSelector(state => state.path.path);

    
    function getShops() {
        setLoader(true);
        // const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.shops}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    setShop(data[0]);
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => {
        getShops()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View
                style={{
                    height: 50,
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                }}
            >
                <TouchableOpacity
                    style={{ padding: 5, borderRadius: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Entypo name="chevron-thin-left" size={24} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20 }}>Support</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 10 }}>

                {/* <Image style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }} source={require('./../../assets/images/banner_support.jpeg')} /> */}

                <Text style={{ marginTop: 20, opacity: 0.5, fontWeight: 'bold' }}>CUSTOMER SUPPORT</Text>
               <TouchableRipple style={{ margin: 10}} onPress={() => setIsSupportOpen(!isSupportOpen)}>
               <View style={{gap: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8,}}>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Customer support</Text>
                        <Text>Looking for assistance? please get in touch and we'll be happy to guide you.</Text>
                    </View>
                    <Entypo size={20} name={ isSupportOpen ?'chevron-thin-down' : 'chevron-thin-right' }/>
                </View>
               </TouchableRipple>

               {/* Query */}
               {
                isSupportOpen ? (
                    <View style={{ gap: 15, margin: 10 }}>
                        <TextInput value={query} onChangeText={(value) => setQuery(value)} multiline={true} numberOfLines={5} mode='outlined' label={'describe your concern...'} placeholder='Tell us more...' />
                        <Button onPress={() => {
                        }} contentStyle={{padding: 5}} mode='contained'>Submit</Button>
                    </View>
                ):null
               }

                {/* Need More Support */}
                <Text style={{ marginTop: 20, opacity: 0.5, fontWeight: 'bold' }}>NEED MORE SUPPORT</Text>
                <View style={{ marginTop: 10, gap: 5 }}>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ width: 50, height: 50, backgroundColor: theme.colors.primaryLight, borderRadius: 100 }}></View>
                        <View>
                            <Text style={{ fontSize: 17 }}>EMAIL CUSTOMER SERVICE</Text>
                            <Text onPress={() => Linking.openURL(shop?.email)} style={{ fontSize: 16, color: theme.colors.primary }}>{shop?.email}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ width: 50, height: 50, backgroundColor: theme.colors.primaryLight, borderRadius: 100 }}></View>
                        <View>
                            <Text style={{ fontSize: 17 }}>CALL CUSTOMER SERVICE</Text>
                            <Text onPress={() => Linking.openURL(`tel:+91${shop?.phone_number}`)} style={{ fontSize: 16, color: theme.colors.primary }}>+91-{shop?.phone_number}</Text>
                        </View>
                    </View>
                 

                </View>
            </ScrollView>

            <Loader loader={loader} setLoader={setLoader} />

            <Snackbar
                visible={snackbar}
                onDismiss={() => setSnackbar(false)}>
                {message}
            </Snackbar>
        </SafeAreaView>
    )
}

export default SupportScreen