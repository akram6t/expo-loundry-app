import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, MD2Colors, Portal, Dialog, useTheme, Divider, Snackbar } from "react-native-paper";
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
    const [visible, setVisible] = React.useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [snackbar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const server = useSelector(state => state.path.path);

    const cart = useSelector(state => state.cart.cart);

    const onOrderPlaced = () => {
        hideDialog();
        setLoading(true);
        const uid = auth.currentUser.uid;
        const insertData = {
            uid: uid,
            items: [...cart],
            pickup_date: dateTime.pickupDateTime,
            delivery_date: dateTime.dropDateTime,
            pickup_address: addresses.pickupAddress,
            delivery_address: addresses.dropAddress,
            payment_type: 'Cash on Delivery',
            service_fee: serviceFee,
            order_status: 'Confirmed'
        } 
        axios.post(`${server.baseUrl}/${api.addorder}`,
            {
               ...insertData
            },
            { headers: {"Content-Type": 'application/json', apikey: server.apikey} })
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
            if (pickDate === currentDate) {
                dif_day = 'today';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]}`;
            } else if (pickDate - 1 === currentDate) {
                dif_day = 'yesterday';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]}`;
            } else if (pickDate + 1 === currentDate) {
                dif_day = 'tomorrow';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]}`;
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
                                        }}
                                    >
                                        <FlatList
                                        numColumns={3}
                                            data={item.services}
                                            keyExtractor={(item) => item.toString()}
                                            renderItem={({item, index}) =>   {
                                                return (
                                                    <Text key={index}>{item.name}{index==servicesLength-1 ? '' : ', '}</Text>
                                                )
                                            }}
                                        />
                                            <Text style={{ fontWeight: 'bold' }}>  X {item.quantity}</Text>

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
                        <Text style={{ fontSize: 17 }}>{addresses.pickupAddress}</Text>
                    </View>

                    <Divider />

                    <View style={{ paddingHorizontal: 5, gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Delivery Address</Text>
                        <Text style={{ fontSize: 17 }}>{addresses.dropAddress}</Text>
                    </View>

                </View>

                {/*  */}

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
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", border: 1, borderColor: MD2Colors.grey200, paddingVertical: 5, paddingHorizontal: 18 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cash on Delivery</Text>
                    <View style={{ flexDirection: "row", marginTop: 2, gap: 0, alignItems: "center" }}>
                        <MaterialCommunityIcons size={20} color={theme.colors.primary} name="currency-inr" />
                        <Text style={{ fontSize: 20, color: theme.colors.primary, fontWeight: 'bold' }}>{totalPrice + serviceFee}</Text>
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

            <Loader loader={loading} setLoader={setLoading}/>

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
