import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, MD2Colors, Portal, Dialog, useTheme, Divider, Snackbar, Chip, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { monthNames, routes, api } from "../Constaints";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import axios from "axios";
import Loader from "../components/Loader";

const CartScreen = ({ navigation }) => {
    const route = useRoute();
    const { shopname, shopid } = route.params;
    const [visible, setVisible] = React.useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [snackbar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [addonsList, setAddonsList] = useState([]);
    const [totalAddonPrice, setTotalAddonPrice] = useState(0);
    const server = useSelector(state => state.path.path);

    function getAddons() {
        setLoading(true);
        axios.get(`${server.baseUrl}/${api.addons}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoading(false);
                const { status, data } = result.data;
                if (status) {
                    setAddonsList([...data]);
                }
            }).catch(err => {
                setLoading(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => getAddons(), []);

    const handleChangeAddons = (item) => {
        const index = addonsList.findIndex(addon => addon._id === item._id);
        const updatedStatusList = [...addonsList];
        updatedStatusList[index].active = !updatedStatusList[index].active;
        setAddonsList(updatedStatusList);
        const totalPrice = addonsList.reduce((acc, obj) => {
            if (obj.active === true) {
                return acc + obj.price;
            }
            return acc;
        }, 0);
        setTotalAddonPrice(totalPrice);
    }

    const [statuses, setStatuses] = useState([]);

    const [addresses, setAddresses] = useState({
        dropAddress: '...',
        pickupAddress: '...'
    })

    const [dateTime, setDateTime] = useState({
        dropDateTime: '...',
        pickupDateTime: '...'
    })

    useEffect(() => {
        setAddresses(route.params.addresses);
        setDateTime(route.params.dateTime);
    }, []);

    const serviceFee = 5.00;

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const cart = useSelector(state => state.cart.cart);

    const getorderstatus = () => {
        setLoading(true);
        axios.get(`${server.baseUrl}/${api.orders_status}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoading(false);
                const { status, data } = result.data;
                if (status) {
                    console.log(data);
                    setStatuses([...data]);
                }
            }).catch(err => {
                setLoading(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => {
        getorderstatus();
    }, []);

    const onOrderPlaced = () => {
        hideDialog();
        setLoading(true);
        const uid = auth.currentUser.uid;
        const addonsFilter = addonsList.filter(item => item.active);
        const insertData = {
            uid: uid,
            storename: shopname,
            storeid: shopid,
            order_status: statuses[0],
            addons: addonsFilter.map(addon =>  {return {name:addon.name, price: addon.price}}),
            items: [...cart],
            pickup_date: dateTime.pickupDateTime,
            delivery_date: dateTime.dropDateTime,
            pickup_address: addresses.pickupAddress,
            delivery_address: addresses.dropAddress,
            payment_type: 'Cash',
            service_fee: serviceFee,
            order_status: statuses[0].tag,
            amount: totalPrice
        }
        axios.post(`${server.baseUrl}/${api.addorder}`,
            {
                ...insertData
            },
            { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then(response => {
                const { status, message } = response.data;
                if (status) {
                    setMessage(message);
                    setLoading(false);
                    setSnackbar(true);
                    navigation.navigate(routes.OrderSuccessScreen);
                }
            }).catch(err => {
                console.log(err);
                setMessage(err);
                setLoading(false);
                setSnackbar(true);
            })


    }

    const theme = useTheme();

    const readableDate = (pick_date) => {
        let stringDate = '';

        const pick = new Date(pick_date);
        const pickDate = pick.getDate();
        const pickMonth = pick.getMonth();
        const pickYear = pick.getFullYear();

        const current = new Date();
        const currentDate = current.getDate();
        const currentMonth = current.getMonth();
        const currentYear = current.getFullYear();


        let dif_day = '';

        stringDate = `${pickDate} ${monthNames[pickMonth]} ${pickYear}`;

        if (currentMonth === pickMonth && currentYear === pickYear) {
            if (pickDate == currentDate) {
                dif_day = 'Today';
                stringDate = `${dif_day}`;
            } else if (pickDate == currentDate -1) {
                dif_day = 'Yesterday';
                stringDate = `${dif_day}`;
            } else if (currentDate +1 == pickDate) {
                dif_day = 'Tomorrow';
                stringDate = `${dif_day}`;
            }

        }

        return stringDate;

    }



    useEffect(() => {
        function calculateTotalPrice(cartData) {
            let totalPrice = 0;

            for (let i = 0; i < cartData.length; i++) {
                const item = cartData[i];

                if (item.quantity > 0) {
                    for (let j = 0; j < item.services.length; j++) {
                        const service = item.services[j];
                        totalPrice += service.price * item.quantity;
                    }
                }
            }

            return totalPrice;
        }

        setTotalPrice(calculateTotalPrice(cart));
    }, [cart]);

    const getAddressInBox = (item) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                        <Chip textStyle={{ fontSize: 12 }}>{item.type ? item.type.toUpperCase() : ''}</Chip>
                    </View>
                </View>
                <Text>{item.mobile}</Text>
                <Text>{item.house} {item.nearby !== '' ? ',' + item.nearby : ''}</Text>
                <Text>{item.area}</Text>
                <Text>{item.city}, {item.state}, {item.pincode}</Text>
            </View>
        )
    }


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
                <Text style={{ fontSize: 20 }}>Confirm Order</Text>
            </View>
            {/* Appbat End */}
            <ScrollView overScrollMode="never" contentContainerStyle={{ backgroundColor: '#f3f3f3', justifyContent: 'space-between' }}>
                {/* Your Cloths */}
                <View style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}>
                    <Text style={{ marginStart: 18, marginTop: 10, color: theme.colors.primary }}>YOUR CLOTHES</Text>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{
                            margin: 10,
                            padding: 10,
                            gap: 5,
                            borderWidth: 1,
                            borderColor: MD2Colors.grey300,
                            borderRadius: 10,
                            // paddingBottom: 20,
                        }}
                        data={cart}
                        renderItem={({ item, index }) => {

                            const total = item.services.reduce((total, next) => total + next.price, 0);
                            const servicesLength = item.services.length;

                            return (
                                <View
                                    style={{
                                        gap: 5,
                                        padding: 3,
                                        borderBottomWidth: 1,
                                        borderBottomColor: MD2Colors.grey200,
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>{item.name} ({item.gender.toUpperCase()})</Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            // backgroundColor: 'red'
                                        }}
                                    >

                                        <FlatList
                                            numColumns={3}
                                            data={item.services}
                                            keyExtractor={(item) => item.toString()}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <Text key={index}>{item.name}{index == servicesLength - 1 ? '' : ', '}</Text>
                                                )
                                            }}
                                        />
                                        <Text style={{ fontWeight: 'bold' }}> X {item.quantity}</Text>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                marginTop: 2,
                                                gap: 0,
                                                alignItems: "center",
                                            }}
                                        >
                                            <MaterialCommunityIcons size={20} name="currency-inr" />
                                            <Text style={{ fontSize: 16 }}>{total * item.quantity}</Text>
                                        </View>


                                    </View>
                                </View>)
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                {/* <View style={{ flex:1, backgroundColor: '#f3f3f3' }}></View> */}
                {/* End Your Cloths */}


                {/*  */}
                <View style={{ backgroundColor: 'white', padding: 8, gap: 12, paddingBottom: 30 }}>

                    <View style={{ paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ gap: 5 }}>
                            <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Pick Up</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{readableDate(dateTime.pickupDateTime.date)}</Text>
                            <Text style={{ opacity: 0.9 }}>{dateTime.pickupDateTime.time}</Text>
                        </View>
                        <View style={{ gap: 5 }}>
                            <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Delivery</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{readableDate(dateTime.dropDateTime.date)}</Text>
                            <Text style={{ opacity: 0.9 }}>{dateTime.dropDateTime.time}</Text>
                        </View>
                    </View>

                    <Divider />

                    <View style={{ paddingHorizontal: 5, gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Pickup Address</Text>
                        {getAddressInBox(addresses.pickupAddress)}
                    </View>

                    <Divider />

                    <View style={{ paddingHorizontal: 5, gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Delivery Address</Text>
                        {getAddressInBox(addresses.dropAddress)}
                    </View>


                    <Divider />

                    {/* Addons */}
                    <View style={{ paddingHorizontal: 5, gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Addons</Text>
                        <FlatList data={addonsList} contentContainerStyle={{ backgroundColor: MD2Colors.grey200, borderRadius: 10 }} scrollEnabled={false} renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                               <View style={{flexDirection: 'row', marginStart: 8, alignItems: 'center'}}>
                                        <MaterialCommunityIcons name='currency-inr' size={15} style={{ }} />
                                        <Text style={{ fontSize: 18, }}>{item.price}</Text>
                                    </View>
                                    <Checkbox.Item
                                        color={theme.colors.primary}
                                        label={item.name}
                                        status={item.active ? 'checked' : 'unchecked'}
                                        onPress={() => handleChangeAddons(item)}
                                    />
                                </View>
                            )
                        }} />
                    </View>


                </View>

            </ScrollView>

            <View>
                <Text style={{ marginStart: 18, marginTop: 10, color: theme.colors.primary }}>PAYMENT INFO</Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: 1,
                        borderColor: MD2Colors.grey200,
                        paddingVertical: 5,
                        paddingHorizontal: 18
                        // margin: 8,
                    }}
                >
                    <Text style={{
                        fontWeight: 'bold', fontSize: 15
                    }}>Sub Total</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 2,
                            gap: 0,
                            alignItems: "center",
                        }}
                    >
                        <MaterialCommunityIcons size={15} name="currency-inr" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalPrice}</Text>
                    </View>

                </View>
                <View
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", border: 1, borderColor: MD2Colors.grey200, paddingVertical: 5, paddingHorizontal: 18 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Service Fee</Text>
                    <View style={{ flexDirection: "row", marginTop: 2, gap: 0, alignItems: "center" }}>
                        {serviceFee === 0 ? null : (<MaterialCommunityIcons size={15} color={MD2Colors.red600} name="currency-inr" />)}
                        <Text style={{ fontSize: 16, color: MD2Colors.red600, fontWeight: 'bold' }}>{serviceFee === 0 ? 'free' : serviceFee}</Text>
                    </View>

                </View>

                {
                    totalAddonPrice > 0 ?
                        (<View
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", border: 1, borderColor: MD2Colors.grey200, paddingVertical: 5, paddingHorizontal: 18 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Addons</Text>
                            <View style={{ flexDirection: "row", marginTop: 2, gap: 0, alignItems: "center" }}>
                                {serviceFee === 0 ? null : (<MaterialCommunityIcons size={15} color={MD2Colors.red600} name="currency-inr" />)}
                                <Text style={{ fontSize: 16, color: MD2Colors.red600, fontWeight: 'bold' }}>{totalAddonPrice}</Text>
                            </View>

                        </View>)
                        : null
                }
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", border: 1, borderColor: MD2Colors.grey200, paddingVertical: 5, paddingHorizontal: 18 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cash on Delivery</Text>
                    <View style={{ flexDirection: "row", marginTop: 2, gap: 0, alignItems: "center" }}>
                        <MaterialCommunityIcons size={20} color={theme.colors.primary} name="currency-inr" />
                        <Text style={{ fontSize: 20, color: theme.colors.primary, fontWeight: 'bold' }}>{totalPrice + serviceFee + totalAddonPrice}</Text>
                    </View>

                </View>

            </View>

            <Button onPress={() => showDialog()} mode="contained" style={{ margin: 8, padding: 3 }}>Confirm Order</Button>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Order Confirmation</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Are you sure want to Order.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => hideDialog()}>Cancel</Button>
                        <Button onPress={() => onOrderPlaced()}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

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
    );
};

export default CartScreen;
