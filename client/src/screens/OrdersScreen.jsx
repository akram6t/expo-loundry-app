import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView
} from "react-native";
import { Divider, MD2Colors, Snackbar, TouchableRipple } from 'react-native-paper';
import React, { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import IconOrderConfirmed from '../../assets/images/icon_order_confirmed.png';
import IconOrderPickup from '../../assets/images/icon_order_pickup.png';
import IconOrderProcess from '../../assets/images/icon_order_process.png';
import IconOrderShipped from '../../assets/images/icon_order_shipped.png';
import IconOrderDelivered from '../../assets/images/icon_order_delivered.png';
import { api, monthNames, routes } from '../Constaints';
import Loader from "../components/Loader";
import { auth } from "../firebaseConfig";
import axios from "axios";
import ItemOrder from "../components/ItemOrder";
import { useSelector } from "react-redux";

const OrdersScreen = ({ navigation }) => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbar, setSnackbar] = useState(false);

    const theme = useTheme();

    const server = useSelector(state => state.path.path);

    function getOrders() {
        setLoading(true);
        const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.orders}/${uid}`, { headers: { "Content-Type": 'application/json' } })
            .then((result, err) => {
                setLoading(false);
                const { status, data } = result.data;
                if (status) {
                    setOrdersList([...data]);
                }
            }).catch(err => {
                setLoading(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }


    useEffect(() => {
        getOrders();
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
                <Text style={{ fontSize: 20 }}>My Orders</Text>
            </View>
            {/* Appbat End */}
            <ScrollView overScrollMode="never">
                <Text style={{ marginTop: 10, marginStart: 10, color: theme.colors.primary }}>Orders</Text>
                <FlatList
                    scrollEnabled={false}
                    nestedScrollEnabled
                    overScrollMode="never"
                    data={ordersList}
                    renderItem={({ item, index }) => {
                        return (
                            <ItemOrder item={item} index={index} status={status}/>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()} />
            </ScrollView>

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

const status = [
    {
        icon: IconOrderConfirmed,
        tag: 'Confirmed'
    },
    {
        icon: IconOrderPickup,
        tag: 'Pickup'
    },
    {
        icon: IconOrderProcess,
        tag: 'InProgress'
    },
    {
        icon: IconOrderShipped,
        tag: 'Shipped'
    },
    {
        icon: IconOrderDelivered,
        tag: 'Delivered'
    }
]

// products data
// const orders_data = [
    // {
    //     "order_id": 1001,
    //     "customer_id": 1,
    //     "provider_id": 101,
    //     "order_date": '19 Jun 10:30 pm',
    //     "pickup_date": '19 Jun 10:30 pm',
    //     "delivery_date": '19 Jun 10:30 pm',
    //     "order_status": 'Shipped',
    //     "items": [
    //         {
    //             "item_id": 201,
    //             "item_name": "Shirt",
    //             "quantity": 5,
    //             "price": 2.99,
    //         },
    //         // Other order items
    //     ]
    // },
    // {
    //     "order_id": 1001,
    //     "customer_id": 1,
    //     "provider_id": 101,
    //     "order_date": '19 Jun 10:30 pm',
    //     "pickup_date": '19 Jun 10:30 pm',
    //     "delivery_date": '19 Jun 10:30 pm',
    //     "order_status": 'Shipped',
    //     "items": [
    //         {
    //             "item_id": 201,
    //             "item_name": "Shirt",
    //             "quantity": 5,
    //             "price": 2.99,
    //         },
    //         // Other order items
    //     ]
    // },
    // {
    //     "order_id": 1001,
    //     "customer_id": 1,
    //     "provider_id": 101,
    //     "order_date": '19 Jun 10:30 pm',
    //     "pickup_date": '19 Jun 10:30 pm',
    //     "delivery_date": '19 Jun 10:30 pm',
    //     "order_status": 'Delivered',
    //     "items": [
    //         {
    //             "item_id": 201,
    //             "item_name": "Shirt",
    //             "quantity": 5,
    //             "price": 2.99,
    //         },
    //         // Other order items
    //     ]
    // },
    // {
    //     "order_id": 1001,
    //     "customer_id": 1,
    //     "provider_id": 101,
    //     "order_date": '19 Jun 10:30 pm',
    //     "pickup_date": '19 Jun 10:30 pm',
    //     "delivery_date": '19 Jun 10:30 pm',
    //     "order_status": 'Delivered',
    //     "items": [
    //         {
    //             "item_id": 201,
    //             "item_name": "Shirt",
    //             "quantity": 5,
    //             "price": 2.99,
    //         },
    //     ]
    // },
    // {
    //     "order_id": 1001,
    //     "customer_id": 1,
    //     "provider_id": 101,
    //     "order_date": '19 Jun 10:30 pm',
    //     "pickup_date": '19 Jun 10:30 pm',
    //     "delivery_date": '19 Jun 10:30 pm',
    //     "order_status": 'Pickup',
    //     "items": [
    //         {
    //             "item_id": 201,
    //             "item_name": "Shirt",
    //             "quantity": 5,
    //             "price": 2.99,
    //         },
    //     ]
    // }
// ];

export default OrdersScreen;
