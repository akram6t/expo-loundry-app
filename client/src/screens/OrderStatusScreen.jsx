import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView
} from "react-native";
import { Divider, MD2Colors, TouchableRipple } from 'react-native-paper';
import React, { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import IconOrderConfirmed from '../../assets/images/icon_order_confirmed.png';
import IconOrderPickup from '../../assets/images/icon_order_pickup.png';
import IconOrderProcess from '../../assets/images/icon_order_process.png';
import IconOrderShipped from '../../assets/images/icon_order_shipped.png';
import IconOrderDelivered from '../../assets/images/icon_order_delivered.png';
import { useRoute } from "@react-navigation/native";
import { monthNames } from "../../Constaints";

const OrdersScreen = ({ navigation }) => {
    const route = useRoute();
    const { item } = route.params;
    // const [OrdersList, setOrdersList] = useState(orders_data);
    const [totalPrice, setTotalPrice] = useState(0);

    const [addresses, setAddresses] = useState({
        dropAddress: item.delivery_address,
        pickupAddress: item.pickup_address
    })

    const [dateTime, setDateTime] = useState({
        dropDateTime: item.delivery_date,
        pickupDateTime: item.pickup_date
    })

    const iconPutting = () => {
        let icon = status[0].icon;
        status.forEach(status => {
            if(status.tag === item.order_status){
                icon = status.icon;
            }
        })
        return icon;
    }


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

    const theme = useTheme();
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
                <Text numberOfLines={1} style={{ fontSize: 20 }}>OrderID - {item._id.slice(0,10)}...</Text>
            </View>
            {/* Appbat End */}


            <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10, gap: 20 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10 }}>
                    <View style={{ padding: 25, borderWidth: 1, borderRadius: 100, borderColor: MD2Colors.grey400 }}>
                        <Image style={{ width: 50, height: 50 }} source={
                           iconPutting() 
                        } />
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={{ opacity: 0.7, fontSize: 16 }}>Order Status</Text>
                        <Text style={{ fontSize: 18, color: theme.colors.primary, fontWeight: 'bold' }}>Order { item.order_status }</Text>
                        <Text style={{ opacity: 0.6 }}>{readableDate(item.order_date)}</Text>
                    </View>
                </View>

                <Divider />

                <View style={{ paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Pick Up</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{readableDate(dateTime.pickupDateTime.date)}</Text>
                        <Text style={{ opacity: 0.9, fontWeight: 'bold' }}>{dateTime.pickupDateTime.time}</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Delivery</Text
                        
                        
                        
                        
                        >
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{readableDate(dateTime.dropDateTime.date)}</Text>
                        <Text style={{ opacity: 0.9,fontWeight: 'bold' }}>{dateTime.dropDateTime.time}</Text>
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

                <Divider />

                <View style={{ paddingHorizontal: 5, gap: 5 }}>
                    <Text style={{ color: MD2Colors.grey500, fontWeight: 'bold' }}>Cloth List</Text>

                    {
                        item.items.map((item, index) => {
                            const total = item.services.reduce((total, next) => total + next.price, 0);
                            return<View key={index} style={{ flexDirection: 'row', gap: 5, padding: 3, justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.quantity} x {item.name} ({item.gender})</Text>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        {item.services.map((service, index) => (
                                            <Text key={index} style={{ fontSize: 11,color: MD2Colors.grey600 }}>{service.name}</Text>
                                        ))}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='currency-inr' size={14} style={{ fontWeight: 'bold' }} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{total * item.quantity}</Text>
                                </View>
                            </View>
                            })
                    }

                </View>

                <Divider />

                <View style={{ paddingHorizontal: 8, gap: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Sub Total</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ totalPrice }</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Service Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' size={15} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.service_fee}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 18 }}>{ item.payment_type }</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='currency-inr' color={theme.colors.primary} size={18} style={{ fontWeight: 'bold' }} />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>{ totalPrice + item.service_fee }</Text>
                        </View>
                    </View>
                </View>


            </ScrollView>

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

export default OrdersScreen;
