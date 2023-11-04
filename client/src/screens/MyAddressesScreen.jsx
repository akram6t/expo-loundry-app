import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, IconButton, MD2Colors, Snackbar, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState, useEffect } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { api } from '../../Constaints';
import { auth } from '../../firebaseConfig';
import * as Location from 'expo-location';

const MyAddressesScreen = ({ navigation }) => {
    const theme = useTheme();
    const [loader, setLoader] = useState(false);
    const [snackBar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [addressesData, setAddressesData] = useState([]);
    const [address, setAddress] = useState({
        name: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        latitude: '',
        longitude: ''

    });
    const [locationServicesEnabled, setLocationServicesEnabled] = useState();

    const removeAddress = (address) => {
        const uid = auth.currentUser.uid;
            setLoader(true);
            // API endpoint to remove an address object
            const apiUrl = `${api.baseUrl}/${api.remove_address}`;

            // Replace with your documentId and addressToRemove data
            const data = {
                uid: uid,
                addressToRemove: address
            };

            axios.post(apiUrl, { ...data }, { headers: { "Content-Type": 'application/json' } })
                .then(response => {
                    setLoader(false);
                    setMessage('address removed successfully...');
                    setSnackbar(true);
                    // console.log('Address removed:', response.data);
                    const { status } = response.data;
                    if(status){
                        getAddresses();
                    }
                })
                .catch(error => {
                    setLoader(false);
                    setMessage(error.toString())
                    setSnackbar(true);
                    console.error('Error removing address:', error);
                });
    }



    const addAddresstoDb = () => {
        setLoader(true);
        // API endpoint to add a new address or create a new document
        const apiUrl = `${api.baseUrl}/${api.add_address}`;

        const uid = auth.currentUser.uid;
        // Replace with your documentId and newAddress data
        const data = {
            uid: uid,
            newAddress: address
        };

        axios.post(apiUrl, data)
            .then(response => {
                setLoader(false);
                setMessage('add address successfully...');
                setSnackbar(true);
                // console.log('Address added or document created:', response.data);
                const { status } = response.data;
                if(status){
                    getAddresses();
                    setAddress({
                        name: '',
                        city: '',
                        region: '',
                        postalCode: '',
                        country: ''
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
        if (address.name === "") {
            setMessage('area name is empty...');
            setSnackbar(true);
            return;
        }
        if (address.city === "") {
            setMessage('city is empty...');
            setSnackbar(true);
            return;
        }
        if (address.region === "") {
            setMessage('region is empty...');
            setSnackbar(true);
            return;
        }
        if (address.postalCode === "") {
            setMessage('postal code is empty...');
            setSnackbar(true);
            return;
        }
        if (address.country === "") {
            setMessage('country is empty...');
            setSnackbar(true);
            return;
        }

        addAddresstoDb();
    }

    const handleChangeText = (name, text) => {
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

        setLoader(true);

        const { coords } = await Location.getCurrentPositionAsync();
        // console.log(coords)
        if (coords) {
            const { latitude, longitude } = coords;
            setAddress({
                ...address,
                latitude: latitude,
                longitude: longitude
            })

            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            setLoader(false);

            // console.log(response)

            for (let item of response) {
                setAddress({
                    name: `${item.name}, ${item.district}`,
                    city: item.city,
                    region: item.region,
                    postalCode: item.postalCode,
                    country: item.country
                });
            }
        }
    };


    const getAddresses = () => {
        setLoader(true);
        const uid = auth.currentUser.uid;
        axios.get(`${api.baseUrl}/${api.addresses}/${uid}`, { headers: { "Content-Type": 'application/json' } })
            .then((result, err) => {
                setLoader(false);
                // console.log(result.data);
                const { status, data } = result.data;
                if (status) {
                    const address_list = data.addresses;
                    if (address_list !== null) {
                        // const a = address_list.map(item => `${item.name}, ${item.city}, ${item.region}, ${item.postalCode}`);
                        setAddressesData([...address_list]);
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


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                <Text style={{ fontSize: 20 }}>Manage Address</Text>
            </View>

            <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: 15 }} enableOnAndroid={true}>

                <Text style={{ color: theme.colors.primary, fontSize: 16, marginTop: 20 }}>MY ADDRESSES</Text>
                {
                    addressesData.length === 0 || addressesData == null ? <Text style={{ marginTop: 15, textAlign: 'center' }}>
                        no addresses please add a new addres
                    </Text> : null
                }
                <View style={{ marginTop: 10, gap: 5 }}>
                    {
                        addressesData.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: MD2Colors.grey300 }}>
                                    <Text style={{ flex: 1, fontSize: 18 }}>{`${item.name}, ${item.city}, ${item.region}, ${item.postalCode}`}</Text>
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => removeAddress(item)}>
                                        <AntDesign name='delete' size={18} color={MD2Colors.red600} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>

                <View style={{ gap: 10 }}>
                    <Text style={{ fontSize: 16, color: theme.colors.primary, marginTop: 20 }}>ADD ADDRESSES</Text>
                    <TextInput mode='outlined' value={address.name} onChangeText={text => handleChangeText('name', text)} name='name' placeholder='road, area, colony' />
                    <TextInput mode='outlined' value={address.city} onChangeText={text => handleChangeText('city', text)} name='city' placeholder="city" />
                    <TextInput mode='outlined' value={address.region} onChangeText={text => handleChangeText('region', text)} name='region' placeholder="state" />
                    <TextInput mode='outlined' value={address.postalCode} onChangeText={text => handleChangeText('postalCode', text)} name='postalCode' placeholder="postal code" />
                    <TextInput mode='outlined' value={address.country} onChangeText={text => handleChangeText('country', text)} name='country' placeholder="country" />
                    <Button mode='outlined' contentStyle={{ padding: 5 }} onPress={() => {
                        getCurrentLocation();
                        checkIfLocationEnabled();
                    }}>Get Current Address</Button>
                </View>
            </KeyboardAwareScrollView>
            <Button mode='contained' style={{ marginHorizontal: 10, marginVertical: 5 }} contentStyle={{ padding: 5 }} onPress={() => handleOnSubmit()}>Add Address</Button>

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

        </SafeAreaView>
    );
};
export default MyAddressesScreen;
