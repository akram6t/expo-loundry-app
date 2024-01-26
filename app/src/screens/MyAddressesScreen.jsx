import { View, Text, TouchableOpacity, Alert, ScrollView, FlatList, StatusBar } from 'react-native';
import { Button, Chip, Dialog, Divider, IconButton, MD2Colors, Portal, Snackbar, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState, useEffect } from 'react';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { api, routes } from '../Constaints';
import { auth } from '../firebaseConfig';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

const MyAddressesScreen = ({ navigation }) => {
    const theme = useTheme();
    const [loader, setLoader] = useState(false);
    const [snackBar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [showNearByInput, setShowNearByInput] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [addressesList, setAddressesList] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUser] = useState({
        name: '',
        mobile: ''
    });
    const [latLon, setLatLon] = useState({
        latitude: '',
        longitude: ''
    });
    const [address, setAddress] = useState({
        name: '',
        mobile: '',
        pincode: '',
        state: '',
        city: '',
        house: '',
        area: '',
        type: 'home',
        nearby: '',
    });
    const [locationServicesEnabled, setLocationServicesEnabled] = useState();

    const server = useSelector(state => state.path.path);

    function getUser() {
        setLoader(true);
        const uid = auth.currentUser.uid;
        if (auth.currentUser == null) return;
        axios.get(`${server.baseUrl}/${api.users}/${uid}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    if (data == null) {
                        getUser();
                    } else {
                        // remove
                        setUser(data);
                        setAddress({ ...address, name: data.name, mobile: data.mobile });
                    }
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    const addAddresstoDb = () => {
        setLoader(true);
        // API endpoint to add a new address or create a new document
        const apiUrl = `${server.baseUrl}/${api.add_address}`;

        const uid = auth.currentUser.uid;
        // Replace with your documentId and newAddress data
        const data = {
            uid: uid,
            ...address,
        };

        axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json', apikey: server.apikey } })
            .then(response => {
                setLoader(false);
                setMessage('add address successfully...');
                setSnackbar(true);
                // console.log('Address added or document created:', response.data);
                const { status } = response.data;
                if (status) {
                    getAddresses();
                    setIsSubmit(false);
                    setAddress({
                        name: user.name,
                        mobile: user.mobile,
                        pincode: '',
                        state: '',
                        city: '',
                        house: '',
                        area: '',
                        type: 'home',
                        nearby: '',
                    })
                }
            })
            .catch(error => {
                setLoader(false);
                setMessage(error.toString());
                setSnackbar(true);
                console.error('Error adding address or creating a document:', error);
            });

    }





    const handleOnSubmit = () => {
        setIsSubmit(true);

        const keysArray = Object.keys(address);
        let isEmpty = false;
        for (const key of keysArray) {
            if (key != 'latlon' && key != 'nearby') {
                if (address[key].trim() == '' || address[key].trim() == null) {
                    isEmpty = true;
                }
            }
        }

        if (isEmpty === false) {
            setOpenDialog(false);
            addAddresstoDb();
        }
    }

    const handleOnChangeAddress = (name, text) => {
        if (name === 'mobile' && text.length > 10) {
            return;
        }
        setAddress({
            ...address,
            [name]: text
        });
    }

    const checkIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert(
                "Location services not enabled",
                "Please enable the location services",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ],
                { cancelable: false }
            );
        } else {
            setLocationServicesEnabled(enabled);
        }
    };
    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "allow the app to use the location services",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ],
                { cancelable: false }
            );
        }


        const { coords } = await Location.getCurrentPositionAsync();
        // console.log(coords)
        if (coords) {
            const { latitude, longitude } = coords;

            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            for (let item of response) {
                setAddress({
                    ...address,
                    latlon: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    house: item.streetNumber ? item.streetNumber : '',
                    area: `${item.name ? item.name + ', ' : ''}${item.street ? item.street + ', ' : ''}${item.district ? item.district : ''}`,
                    city: item.city ? item.city : '',
                    state: item.region ? item.region : '',
                    pincode: item.postalCode ? item.postalCode : '',
                });
            }
        }
    };


    const getAddresses = () => {
        setLoader(true);
        const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.addresses}/${uid}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                // console.log(result.data);
                const { status, data } = result.data;
                if (status) {
                    setAddressesList(data);
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    const handleDeleteAddress = (id) => {
        setLoader(true);
        axios.post(`${server.baseUrl}/${api.remove_address}`, { _id: id }, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                // console.log(result.data);
                const { status } = result.data;
                if (status) {
                    getAddresses();
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
        getUser();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
            <StatusBar backgroundColor={MD2Colors.grey200} />
{/* Appbar */}
<View
                style={{
                    // marginTop: 20,
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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ fontSize: 20 }}>Saved Address</Text>
                <TouchableOpacity onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: routes.HomeScreen }]
                          })
                }}>
                    <AntDesign size={25} name="home"/>
                </TouchableOpacity>
                </View>
            </View>
            {/* Appbat End */}


            <View style={{ paddingHorizontal: 15 }}>

                <View style={{ marginTop: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.colors.primary, fontSize: 16 }}>MY ADDRESSES</Text>
                    <Button onPress={() => {
                        setOpenDialog(true);
                        setIsSubmit(false);
                        setAddress({
                            name: user.name,
                            mobile: user.mobile,
                            pincode: '',
                            state: '',
                            city: '',
                            house: '',
                            area: '',
                            type: 'home',
                            nearby: '',
                        })
                    }} mode='contained' icon={'plus'}>Add</Button>
                </View>
                {
                    addressesList.length === 0 ?
                        <Text style={{ textAlign: 'center', justifyContent: 'center' }}>
                            no address found
                        </Text>

                        : <FlatList data={addressesList}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ gap: 10 }}
                            renderItem={({ item, index }) => {
                                const firstChildMargin = index === 0;
                                return <View key={index} style={{ backgroundColor: 'white', elevation: 2, marginTop: firstChildMargin ? 20 : 0, borderWidth: 1, borderColor: MD2Colors.grey300, padding: 10, borderRadius: 10 }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
                                            <Chip>{item.type.toUpperCase()}</Chip>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDeleteAddress(item._id)}>
                                            <MaterialIcons name='delete-outline' size={25} color={'brown'} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{item.mobile}</Text>
                                    <Text>{item.house} {item.nearby !== '' ? ','+item.nearby:'' }</Text>
                                    <Text>{item.area}</Text>
                                    <Text>{item.city}, {item.state}, {item.pincode}</Text>
                                </View>
                            }} />

                }

            </View>
            {/* <Button mode='contained' style={{ marginHorizontal: 10, marginVertical: 5 }} contentStyle={{ padding: 5 }} onPress={() => setOpenDialog(true)}>+ Add</Button> */}

            <Loader loader={loader} setLoader={setLoader} />

            <Snackbar
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

            {/* Add Address Dialog box */}
            <Portal>
                <Dialog theme={{ roundness: 0 }} style={{
                    marginStart: 0,
                    width: '100%',
                    height: '100%',
                }} visible={openDialog} onDismiss={() => setOpenDialog(false)}>
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginStart: 10 }}>Add Address</Text>
                        <IconButton icon={'close'} size={30} onPress={() => setOpenDialog(false)} />
                    </View>
                    <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={{ paddingVertical: 10, gap: 8, paddingHorizontal: 20 }}>
                        <TextInput error={isSubmit && !address.name} value={address.name} onChangeText={(value) => handleOnChangeAddress('name', value)} mode='outlined' label={'Full Name (Required)*'} />
                        <TextInput keyboardType='number-pad' error={isSubmit && address.mobile.length < 10} value={address.mobile} onChangeText={(value) => handleOnChangeAddress('mobile', value)} mode='outlined' label={'Phone number (Required)*'} />

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <TextInput keyboardType='number-pad' error={isSubmit && !address.pincode} value={address.pincode} onChangeText={(value) => handleOnChangeAddress('pincode', value)} style={{ flex: 1 }} mode='outlined' label={'Pincode (required)*'} />
                            <Button onPress={() => {
                                checkIfLocationEnabled();
                                getCurrentLocation();
                            }} labelStyle={{ fontSize: 14, textTransform: 'none' }} contentStyle={{ paddingVertical: 6 }} mode='contained' icon={'target'}>Use my location</Button>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <TextInput error={isSubmit && !address.state} value={address.state} onChangeText={(value) => handleOnChangeAddress('state', value)} style={{ flex: 1 }} mode='outlined' label={'State (required)*'} />
                            <TextInput error={isSubmit && !address.city} value={address.city} onChangeText={(value) => handleOnChangeAddress('city', value)} style={{ flex: 1 }} mode='outlined' label={'City (required)*'} />
                        </View>
                        <TextInput error={isSubmit && !address.house} mode='outlined' value={address.house} onChangeText={(value) => handleOnChangeAddress('house', value)} label={'House No., Building Name (required)*'} />
                        <TextInput error={isSubmit && !address.area} mode='outlined' value={address.area} onChangeText={(value) => handleOnChangeAddress('area', value)} label={'Road name, Area, Colony (required)*'} />

                        <View style={{ marginTop: 10, gap: 5 }}>
                            <TouchableOpacity onPress={() => setShowNearByInput(!showNearByInput)} style={{ paddingVertical: 3 }}>
                                <Text style={{ color: theme.colors.primary }}>{showNearByInput ? '--' : '+'} Add Nearby Famous Shop/Mall/Landmark</Text>
                            </TouchableOpacity>

                            {showNearByInput ? <TextInput onChangeText={(value) => handleOnChangeAddress('nearby', value)} mode='outlined' label={'Shop/Mall/Landmark (Optional)'} /> : null}
                        </View>
                        <Divider />
                        <Text>Type of address</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button style={[{ borderRadius: 100 }, address.type === 'home' ? { backgroundColor: theme.colors.primaryLight, borderWidth: 1, borderColor: theme.colors.primary } : {}]} onPress={() => setAddress({ ...address, type: 'home' })} mode='outlined' labelStyle={{ textTransform: 'none' }} icon="home">Home</Button>
                            <Button style={[{ borderRadius: 100 }, address.type === 'work' ? { backgroundColor: theme.colors.primaryLight, borderWidth: 1, borderColor: theme.colors.primary } : {}]} onPress={() => setAddress({ ...address, type: 'work' })} mode='outlined' labelStyle={{ textTransform: 'none' }} icon="office-building">Work</Button>
                        </View>
                        {/* <TextInput style={{ flex: 1 }} mode='outlined' label={'City (required)*'} /> */}
                        <Button style={{ marginTop: 15 }} contentStyle={{ padding: 5 }} mode='contained' onPress={() => handleOnSubmit()}>Save Address</Button>
                    </KeyboardAwareScrollView>
                </Dialog>
            </Portal>

        </SafeAreaView>
    );
};
export default MyAddressesScreen;
