import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    RefreshControl,
    ScrollView
} from "react-native";
import { Button, Divider, MD2Colors, Snackbar, TouchableRipple } from 'react-native-paper';
import React, { useState, useEffect } from "react";
import { useTheme, } from "react-native-paper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// import IconOrderConfirmed from '../../assets/images/icon_order_confirmed.png';
// import IconOrderPickup from '../../assets/images/icon_order_pickup.png';
// import IconOrderProcess from '../../assets/images/icon_order_process.png';
// import IconOrderShipped from '../../assets/images/icon_order_shipped.png';
// import IconOrderDelivered from '../../assets/images/icon_order_delivered.png';
import { api, routes } from '../Constaints';
import Loader from "../components/Loader";
import { auth } from "../firebaseConfig";
import axios from "axios";
import ItemOrder from "../components/ItemOrder";
import { useSelector } from "react-redux";
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from "@react-navigation/native";

const OrdersScreen = ({ navigation }) => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbar, setSnackbar] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [ status, setStatus ] = useState([]);
    const [ skip, setSkip ] = useState(0);
    const [ ordersEnd, setOrderEnd ] = useState(false);

    const theme = useTheme();

    const server = useSelector(state => state.path.path);

    function getOrders() {
        setLoading(true);
        const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.orders}/${uid}?skip=${skip}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoading(false);
                const { status, data } = result.data;
                if (status) {
                    setSkip(skip + 7);
                    setOrdersList([...ordersList, ...data]);
                    if(data.length < 7){
                        setOrderEnd(true);
                    }
                }
            }).catch(err => {
                setLoading(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useFocusEffect(
        React.useCallback(() => {
           onRefresh();

            return () => {
                console.log('ScreenA unfocused');
            };
        }, [])
    );

    function getorderstatus() {
        setLoading(true);
        axios.get(`${server.baseUrl}/${api.orders_status}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoading(false);
                const { status, data } = result.data;
                if (status) {
                    setStatus([...data]);
                }
            }).catch(err => {
                setLoading(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }


    useEffect(() => {
        Promise.all([ getOrders(), getorderstatus() ]);
    }, []);


    const onRefresh = React.useCallback(() => {
        setOrderEnd(false);
        setSkip(0);
        setOrdersList([]);
        setRefreshing(true);
        Promise.all([ getOrders(), getorderstatus() ]);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (<View style={{ flex: 1 }}>
        <StatusBar backgroundColor={MD2Colors.grey200} />

        <SafeAreaView style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
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
                <Text style={{ fontSize: 20 }}>Orders</Text>
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

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            <FlatList
                scrollEnabled={false}
                overScrollMode="never"
                data={ordersList}
                renderItem={({ item, index }) => {
                    
                    return (
                        <ItemOrder  server={server} item={item} index={index} status={status} />
                    )
                }}
                keyExtractor={(item, index) => index.toString()} />
                <Button disabled={ordersEnd} onPress={() => getOrders()} loading={loading}>{!ordersEnd ? 'load more' : 'No orders available'}</Button>

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
    </View>
    );
};

// const status = [
//     {
//         icon: IconOrderConfirmed,
//         tag: 'Confirmed',
//         color: '#688080'
//     },
//     {
//         icon: IconOrderPickup,
//         tag: 'Pickup',
//         color: '#FFA500'
//     },
//     {
//         icon: IconOrderProcess,
//         tag: 'InProgress',
//         color: '#FFD700'
//     },
//     {
//         icon: IconOrderShipped,
//         tag: 'Shipped',
//         color: '#1E0080'
//     },
//     {
//         icon: IconOrderDelivered,
//         tag: 'Delivered',
//         color: 'green'
//     },
// ]


export default OrdersScreen;
