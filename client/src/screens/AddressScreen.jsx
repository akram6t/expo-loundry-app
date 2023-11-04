import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Button, TextInput, MD2Colors, Divider, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { routes, api } from '../../Constaints';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import Loader from '../components/Loader';
import { useRoute } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';


const AddressScreen = ({ navigation }) => {
    // const [text, setText] = useState();
    const theme = useTheme();

    const route = useRoute();
    const [loader, setLoader] = useState(false);

    const [addresses, setAddresses] = useState([
        'add new address'
    ]);

    const [snackBar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    const [pickupAddress, setPickupAddress] = useState('');
    const [dropAddress, setDropAddress] = useState('');


    const getAddresses = () => {
        setLoader(true);
        const uid = auth.currentUser.uid;
        axios.get(`${api.baseUrl}/${api.addresses}/${uid}`, { headers: { "Content-Type": 'application/json' } })
            .then((result, err) => {
                setLoader(false);
                // console.log(result.data);
                const { status, data } = result.data;
                const address_list = data.addresses;
                console.log(status);
                if (status) {
                    if (address_list !== null) {
                        [...address_list].map(item => setAddresses([...addresses, `${item.name}, ${item.city}, ${item.region}, ${item.postalCode}`]));
                    }
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => {
        getAddresses();
    }, []);

    const goToOrderScreen = () => {
        if (pickupAddress === "") {
            setMessage('please select pickup address');
            setSnackbar(true);
            return;
        }
        if (dropAddress === "") {
            setMessage('please select drop address');
            setSnackbar(true);
            return;
        }

        const sendData = {
            dateTime: route.params.dateTime,
            addresses: { pickupAddress, dropAddress }
        }

        navigation.navigate(routes.ConfirmOrderScreen, sendData)


    }



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
                <Text style={{ fontSize: 20 }}>Select Address</Text>
            </View>

            {/* Appbar End */}

            <ScrollView overScrollMode='never' contentContainerStyle={{ gap: 10 }}>
                <View>
                    <Text style={{ marginTop: 20, marginLeft: 15, color: theme.colors.primary }}>pickup Info</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20 }}>Pickup Info</Text>
                        <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_pickup.png')} />
                    </View>
                    <View style={{ marginTop: 20, gap: 8, padding: 15 }}>
                        <SelectDropdown
                            renderSearchInputLeftIcon={() => <Entypo name='chevron-down' />}
                            defaultButtonText='Select Pickup Address'
                            buttonStyle={{ width: '100%', borderRadius: 10, borderWidth: 1, borderColor: MD2Colors.grey300 }}
                            dropdownStyle={{ width: '90%', borderRadius: 10, elevation: 10 }}
                            data={addresses}
                            onSelect={(selectedItem, index) => {
                                if(selectedItem !== 'add new address'){
                                  setPickupAddress(selectedItem);
                                }else{
                                    navigation.navigate(routes.MyAddressesScreen);
                                }
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                if(selectedItem !== 'add new address'){
                                    // setDropAddress(selectedItem);
                                    return selectedItem;
                                  }else{
                                      return 'Select Pickup Address'
                                  }
                            }}
                            rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item
                            }}
                        />
                    </View>
                </View>

                <Divider />

                <View>
                    <Text style={{ marginTop: 20, marginLeft: 15, color: theme.colors.primary }}>Drop Info</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, borderRadius: 10 }}>
                        <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_drop.png')} />
                        <Text style={{ fontSize: 20 }}>Drop Info</Text>
                    </View>
                    <View style={{ marginTop: 20, gap: 8, padding: 15 }}>
                        <SelectDropdown
                            defaultButtonText='Select Drop Address'
                            buttonStyle={{ width: '100%', borderRadius: 10, borderWidth: 1, borderColor: MD2Colors.grey300 }}
                            dropdownStyle={{ width: '90%', borderRadius: 10, elevation: 10 }}
                            data={addresses}
                            onSelect={(selectedItem, index) => {
                                // console.log(selectedItem, index)
                                if(selectedItem !== 'add new address'){
                                    setDropAddress(selectedItem);
                                  }else{
                                      navigation.navigate(routes.MyAddressesScreen);
                                  }
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                // return selectedItem
                                if(selectedItem !== 'add new address'){
                                    // setDropAddress(selectedItem);
                                    return selectedItem;
                                  }else{
                                      return 'Select Drop Address'
                                  }
                                //   return 
                            }}
                            rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            <Button mode="outlined" style={{ margin: 8, padding: 3 }} onPress={() => navigation.navigate(routes.MyAddressesScreen)}>Manage Address</Button>
            <Button mode="contained" style={{ margin: 8, marginTop: 0, padding: 5 }} onPress={() => goToOrderScreen()}>Continue</Button>

            <Loader loader={loader} setLoader={setLoader} />

            <Snackbar
                style={{ position: 'fixed', bottom: 0, left: 0 }}
                visible={snackBar}
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

export default AddressScreen