import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Button, TextInput, Dialog, Portal, Divider, Snackbar, TouchableRipple, IconButton, Chip, MD2Colors, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { routes, api } from '../Constaints';
import axios from 'axios';
import Loader from '../components/Loader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const AddressScreen = ({ navigation }) => {
    // const [text, setText] = useState();
    const theme = useTheme();

    const [checked, setChecked] = React.useState(-1);

    const route = useRoute();
    const { shopname, shopid } = route.params;
    const [loader, setLoader] = useState(false);
    const [openPickupDialog, setOpenPickupDialog] = useState(false);
    const [openDropDialog, setOpenDropDialog] = useState(false);

    const [addressesList, setAddressesList] = useState([]);

    const [snackBar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    const [pickupAddress, setPickupAddress] = useState(-1);
    const [dropAddress, setDropAddress] = useState(-1);

    const server = useSelector(state => state.path.path);

    useFocusEffect(
        React.useCallback(() => {

            getAddresses();

            return () => {
                console.log('ScreenA unfocused');
            };
        }, [])
    );


    const getAddresses = () => {
        setLoader(true);
        const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.addresses}/${uid}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    if(data.length === 0){
                        setPickupAddress(-1);
                        setDropAddress(-1);
                    }
                    setAddressesList(data);
                    // console.log(data);
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
        if (pickupAddress === -1) {
            setMessage('please select pickup address');
            setSnackbar(true);
            return;
        }
        if (dropAddress === -1) {
            setMessage('please select drop address');
            setSnackbar(true);
            return;
        }

        const sendData = {
            shopname: shopname,
            shopid: shopid,
            dateTime: route.params.dateTime,
            addresses: { pickupAddress: addressesList[pickupAddress], dropAddress: addressesList[dropAddress] }
        }

        navigation.navigate(routes.ConfirmOrderScreen, sendData)


    }

    useEffect(() => {
        setOpenPickupDialog(false);
    }, [pickupAddress]);
    useEffect(() => {
        setOpenDropDialog(false);
    }, [dropAddress]);


    const getAddressInBox = (item) => {
        return (
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.name}</Text>
                            <Chip textStyle={{ fontSize:12 }}>{item?.type?item.type.toUpperCase():''}</Chip>
                        </View>
                    </View>
                    <Text>{item?.mobile}</Text>
                    <Text>{item?.house} {item?.nearby !== '' ? ','+item?.nearby:'' }</Text>
                    <Text>{item?.area}</Text>
                    <Text>{item?.city}, {item?.state}, {item?.pincode}</Text>
                </View>
        )
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

            <ScrollView overScrollMode='never' contentContainerStyle={{ gap: 10, paddingBottom: 50 }}>
                <View>
                    <Text style={{ marginTop: 20, marginLeft: 15, color: theme.colors.primary }}>pickup Info</Text>
                    <View style={{ backgroundColor: theme.colors.primaryLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20 }}>Pickup Info</Text>
                        <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_pickup.png')} />
                    </View>
                    <View style={{ marginTop: 20, gap: 8, padding: 15 }}>

                        <TouchableRipple style={{ padding: 10, borderBottomWidth: 1 }} onPress={() => setOpenPickupDialog(true)}>
                            <View style={{ }}>
                                {  pickupAddress >=0 ? getAddressInBox(addressesList[pickupAddress])
                                    :<Text>Select pickup address</Text>
                                } 
                            </View>
                        </TouchableRipple>
                    </View>
                </View>

                <Divider />

                <View>
                    <Text style={{ marginTop: 20, marginLeft: 15, color: theme.colors.primary }}>Drop Info</Text>
                    <View style={{ backgroundColor: theme.colors.primaryLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, borderRadius: 10 }}>
                        <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/sticker_drop.png')} />
                        <Text style={{ fontSize: 20 }}>Drop Info</Text>
                    </View>
                    <View style={{ marginTop: 20, gap: 8, padding: 15 }}>

                        <TouchableRipple style={{ padding: 10, borderBottomWidth: 1 }} onPress={() => setOpenDropDialog(true)}>
                        <View style={{ }}>
                                { dropAddress >=0 ? getAddressInBox(addressesList[dropAddress])
                                    :<Text>Select delivery address</Text>
                                } 
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>

            <Button mode="outlined" contentStyle={{padding: 5}} style={{ margin: 8 }} onPress={() => navigation.navigate(routes.MyAddressesScreen)}>Manage Address</Button>
            <Button mode="contained" contentStyle={{padding:5}} style={{ margin: 8, marginTop: 0 }} onPress={() => goToOrderScreen()}>Continue</Button>

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

            {/* Pickup Dialog */}
            <Portal>
                <Dialog style={{
                    backgroundColor: MD2Colors.grey200
                }} visible={openPickupDialog} onDismiss={() => setOpenPickupDialog(false)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginStart: 10 }}>Select Pickup Address</Text>
                        <IconButton icon={'close'} size={30} onPress={() => setOpenPickupDialog(false)} />
                    </View>
                    { addressesList.length == 0 ? <Button style={{ margin: 10 }} mode='contained' onPress={() => {setOpenPickupDialog(false); navigation.navigate(routes.MyAddressesScreen)}}>Add new address</Button> : null}
                    <FlatList data={addressesList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 10, padding: 8 }}
                        renderItem={({ item, index }) => {
                            return <TouchableRipple style={{ backgroundColor: 'white', borderWidth: 1, borderColor: MD2Colors.grey300, borderRadius: 10 }}
                                onPress={() => setPickupAddress(index)}>
                                <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center', elevation: 2, backgroundColor: 'white', padding: 10 }}>
                                    <RadioButton color={theme.colors.primary} onPress={() => setPickupAddress(index)} value={pickupAddress} status={pickupAddress === index ? 'checked' : 'unchecked'} />
                                    <View key={index} style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                                <Chip>{item.type.toUpperCase()}</Chip>
                                            </View>
                                        </View>
                                        <Text>{item.mobile}</Text>
                                        <Text>{item.house}, {item.nearby}</Text>
                                        <Text>{item.area}</Text>
                                        <Text>{item.city}, {item.state}, {item.pincode}</Text>
                                    </View>
                                </View>
                            </TouchableRipple>
                        }} />
                </Dialog>
            </Portal>

            {/* Drop Dialog */}
            <Portal>
                <Dialog style={{
                    backgroundColor: MD2Colors.grey200
                }} visible={openDropDialog} onDismiss={() => setOpenDropDialog(false)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginStart: 10 }}>Select Delivery Address</Text>
                        <IconButton icon={'close'} size={30} onPress={() => setOpenDropDialog(false)} />
                    </View>
                    { addressesList.length == 0 ? <Button style={{ margin: 10 }} mode='contained' onPress={() => {setOpenDropDialog(false); navigation.navigate(routes.MyAddressesScreen);}}>Add new address</Button> : null}
                    <FlatList data={addressesList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 10, padding: 8 }}
                        renderItem={({ item, index }) => {
                            return <TouchableRipple style={{ backgroundColor: 'white', borderWidth: 1, borderColor: MD2Colors.grey300, borderRadius: 10 }}
                                onPress={() => setDropAddress(index)}>
                                <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center', elevation: 2, backgroundColor: 'white', padding: 10 }}>
                                    <RadioButton color={theme.colors.primary} onPress={() => setDropAddress(index)} value={dropAddress} status={dropAddress === index ? 'checked' : 'unchecked'} />
                                    <View key={index} style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                                <Chip>{item.type.toUpperCase()}</Chip>
                                            </View>
                                        </View>
                                        <Text>{item.mobile}</Text>
                                        <Text>{item.house}, {item.nearby}</Text>
                                        <Text>{item.area}</Text>
                                        <Text>{item.city}, {item.state}, {item.pincode}</Text>
                                    </View>
                                </View>
                            </TouchableRipple>
                        }} />
                </Dialog>
            </Portal>

        </SafeAreaView>
    )
}

export default AddressScreen