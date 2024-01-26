import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView
} from "react-native";
import { Button, Checkbox, Chip, Dialog, Divider, IconButton, MD2Colors, MD3Colors, Modal, Portal, Snackbar, TouchableRipple } from 'react-native-paper';
import React, { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { api, routes } from "../Constaints";
import { useSelector } from "react-redux";
import * as Clipboard from 'expo-clipboard';
import Loader from "../components/Loader";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { ImageIdentifier } from "../utils/ImageIdentifier";
import * as Linking from 'expo-linking';
import { formatDate } from "../utils/FormatDate";
// import * as Call from 'expo-call';

const OrdersScreen = ({ navigation }) => {
    const theme = useTheme();
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const route = useRoute();
    const [statusColor, setStatusColor] = useState(theme.colors.primary);
    const { item, status } = route.params;
    const [ orderStatus, setOrderStatus ] = useState(item.order_status);
    // const [OrdersList, setOrdersList] = useState(orders_data);
    const [totalPrice, setTotalPrice] = useState(0);

    const [shop, setShop] = useState(null);
    const [cancelledStep, setCancelledStep] = useState(0);

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbar, setSnackbar] = useState(false);

    const [totalAddonPrice, setTotalAddonPrice] = useState(0);

    const [addresses, setAddresses] = useState({
        dropAddress: item.delivery_address,
        pickupAddress: item.pickup_address
    })

    const server = useSelector(state => state.path.path);


    function getShops() {
        setLoader(true);
        // const uid = auth.currentUser.uid;
        if (auth.currentUser == null) return;
        axios.get(`${server.baseUrl}/${api.shops}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    setShop(data[0]);
                    setCancelledStep(data[0]?.cancelledStep);
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

    useEffect(() => {
        if (!item?.addons) {
            return;
        }
        const totalPrice = item?.addons?.reduce((acc, obj) => {
            if (obj.active === true) {
                return acc + obj.price;
            }
            return acc;
        }, 0);
        setTotalAddonPrice(totalPrice);
        // console.log("price" + totalPrice);
    }, [])

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(item.order_id);
        setMessage('copied...');
        setSnackbar(true);
    };


    const [dateTime, setDateTime] = useState({
        dropDateTime: item.delivery_date,
        pickupDateTime: item.pickup_date
    })

    const iconPutting = () => {
        let icon = status[0].icon;
        status.forEach(status => {
            if (status.tag === item.order_status) {
                icon = status.icon;
            }
        })
        return icon;
    }

    const checkforCancelOrder = () => {
        let co = false;
        status.forEach((status, index) => {
            if (status.tag === item.order_status) {
                console.log("cancelledStep: "+cancelledStep);
                if (index <= cancelledStep) {
                    co = true;
                }
            }
        })
        return co;
    }

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

    useEffect(() => {
        setTotalPrice(calculateTotalPrice(item.items));
    }, []);

    const cancelStatusFind = () => {
        const updateStatus = status.find((e) => e.type==='cancelled').tag;
        console.log(updateStatus);
        return updateStatus;
    }

    const handleCancelOrder = () => {
        setOpenCancelDialog(false);
        setLoader(true);
        axios.post(`${server.baseUrl}/${api.cancel_order}`, {
          order_id: item.order_id,
          update_status: cancelStatusFind()
        }, {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
        .then((result, err) => {
            setLoader(false);
          const {status, message} = result.data;
          if(status){
            setMessage(message);
            setSnackbar(true);
            setOrderStatus(cancelStatusFind());
          }
        }).catch(err => {
        setLoader(false);
          setMessage(`${err}`);
          setSnackbar(true);
          console.log(err);
        })
    }

    const getStatusColorCode = () => {
        status.map((status, index) => {
            if (status.tag === item.order_status) {
                setStatusColor(status.color);
            }
        })
    }

    useEffect(() => {
        getStatusColorCode()
    }, [])

    const deliveryBoyWhatsapp = (number) => {
        if(number === '0000000000'){
            setMessage('This features not available');
            setSnackbar(true);
        }else{
            Linking.openURL(`http://api.whatsapp.com/send?phone=+91${number}`);
        }
    }

    const deliveryBoyCall = (number) => {
        Linking.openURL(`tel:+91${number}`);
    }


    const getAddressInBox = (item) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                        <Chip textStyle={{ fontSize: 12, }}>{item.type ? item.type.toUpperCase() : ''}</Chip>
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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20 }}>Order Id - #{item?.order_id}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: routes.HomeScreen }]
                        })
                    }}>
                        <AntDesign size={25} name="home" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Appbat End */}


            <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10, gap: 20 }}>
                {/* Delivery partner */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 10, backgroundColor: theme.colors.primaryLight, borderWidth: 1, borderColor: theme.colors.primary }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Image style={{ width: 50, height: 50 }} source={require('./../../assets/images/icon_user.png')} />
                        <View>
                            <Text style={{ fontSize: 18 }}>{shop?.delivery_partner?.name}</Text>
                            <Text style={{ fontSize: 14, opacity: 0.5 }}>{shop?.delivery_partner?.title}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton icon="whatsapp" onPress={() => deliveryBoyWhatsapp(shop?.delivery_partner?.whatsapp_number)} />
                        <IconButton icon="phone" onPress={() => deliveryBoyCall(shop?.delivery_partner?.phone_number)} />
                    </View>
                </View>

                {/* <Divider /> */}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10 }}>
                    <View style={{ padding: 25, borderWidth: 1, borderRadius: 100, borderColor: MD2Colors.grey400 }}>
                        <Image style={{ width: 50, height: 50 }} source={
                            { uri: ImageIdentifier(iconPutting(), server)}
                        } />
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={{ opacity: 0.7, fontSize: 16 }}>Order Status</Text>
                        <Text style={{ fontSize: 18, color: statusColor, fontWeight: 'bold' }}>{orderStatus}</Text>
                        <Text style={{ opacity: 0.6 }}>{formatDate(item.order_date)}</Text>
                    </View>
                </View>

                <Divider />

                <View style={{ paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Pick Up</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{formatDate(dateTime.pickupDateTime.date)}</Text>
                        <Text style={{ opacity: 0.9, fontWeight: 'bold' }}>{dateTime.pickupDateTime.time}</Text>
                    </View>
                    {/* <View style={{ gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Delivery</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{formatDate(dateTime.dropDateTime.date)}</Text>
                        <Text style={{ opacity: 0.9, fontWeight: 'bold' }}>{dateTime.dropDateTime.time}</Text>
                    </View> */}
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

                <View style={{ paddingHorizontal: 5, gap: 5 }}>
                    <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Cloth List</Text>

                    {
                        item?.items?.map((item, index) => {
                            const servicesLength = item.services.length;
                            const total = item.services.reduce((total, next) => total + next.price, 0);
                            return <View key={index} style={{ flexDirection: 'row', gap: 5, padding: 3, justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.quantity} x {item.name} ({item.gender})</Text>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        {/* {item.services.map((service, index) => ( */}
                                        {/* <Text key={index} style={{ fontSize: 11,color: MD2Colors.grey600 }}>{service.name}</Text> */}
                                        {/* ))} */}
                                        <FlatList
                                            scrollEnabled={false}
                                            numColumns={4}
                                            data={item.services}
                                            keyExtractor={(item) => item.toString()}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <Text key={index} style={{ fontSize: 11, color: MD2Colors.grey600 }}>{item.name}{index == servicesLength - 1 ? '' : ', '}</Text>
                                                )
                                            }}
                                        />
                                    </View>
                                </View>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='currency-inr' size={14} style={{ fontWeight: 'bold' }} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{total * item.quantity}</Text>
                                </View> */}
                            </View>
                        })
                    }

                </View>

                {
                    totalAddonPrice > 0 && (<View style={{ paddingHorizontal: 5, gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Addons</Text>
                        <FlatList data={item?.addons} contentContainerStyle={{ backgroundColor: MD2Colors.grey200, borderRadius: 10 }} scrollEnabled={false} 
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{flexDirection: 'row', marginStart: 8, opacity: 0.3, alignItems: 'center'}}>
                                        <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}</Text>
                                    </View>
                                    <Checkbox.Item
                                    style={{}}
                                        disabled
                                        color={theme.colors.primary}
                                        label={item.name}
                                        status={item.active ? 'checked' : 'unchecked'}
                                    />
                                </View>
                            )
                        }} />
                    </View>)
                }


                <Divider />

                <View style={{ paddingHorizontal: 8, gap: 5 }}>
                    {/* Sub Total */}
                    {totalAddonPrice > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Sub Total</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{totalPrice}</Text>
                        </View>
                    </View>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Service Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.service_fee}</Text>
                        </View>
                    </View>
                    {
                        totalAddonPrice > 0 ?
                            (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>Addons</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{totalAddonPrice}</Text>
                                </View>
                            </View>)
                            : null
                    }
                    {/* Total */}
                    {item?.amount > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 18 }}>Total</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' color={theme.colors.primary} size={18} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>{totalPrice + item.service_fee + totalAddonPrice}</Text>
                        </View>
                    </View>}

                </View>

                <Divider />

                {checkforCancelOrder() ?

                    <View style={{ padding: 8, marginBottom: 30 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Actions</Text>
                        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setOpenCancelDialog(true)}>
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel Order</Text>
                        </TouchableOpacity>
                    </View>

                    : null

                }

            </ScrollView>

            <Loader loader={loader} setLoader={setLoader} />

            {/* Snackbar */}
            <Snackbar visible={snackbar} onDismiss={() => setSnackbar(false)}>
                {message}
            </Snackbar>


            <Portal>
                <Dialog visible={openCancelDialog} onDismiss={() => setOpenCancelDialog(false)}>
                    <Dialog.Title>Cancel Order</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Are you sure want to cancel order.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setOpenCancelDialog(false)}>Cancel</Button>
                        <Button onPress={() => handleCancelOrder()}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </SafeAreaView>
    );
};

export default OrdersScreen;
