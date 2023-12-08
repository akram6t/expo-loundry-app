import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme, TouchableRipple, MD2Colors, Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { monthNames, routes } from '../Constaints'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ItemOrder = ({item, index, status, server}) => {
    const theme = useTheme();
    const [ statusColor, setStatusColor ] = useState(theme.colors.primary);
    const navigation = useNavigation();
    const [ totalPrice, setTotalPrice ] = useState(0);
    let opacity = 1;
    isStatusOver = false;

    const getStatusColorCode = () => {
        status.map((status, index) => {
            if(status.tag === item.order_status){
                // console.log(status.color);
                setStatusColor(status.color);
            }
        })
    }

    useEffect(() => getStatusColorCode(), []);

    const dateFormated = (pick_date) => {
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

        stringDate = `${pickDate} ${monthNames[pickMonth]} ${pick.getHours()}:${pick.getMinutes()} ${pickYear}`;

        if (currentMonth === pickMonth && currentYear === pickYear) {
            if (pickDate === currentDate) {
                dif_day = 'Today';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]} ${pick.getHours()}:${pick.getMinutes()}`;
            } else if (pickDate - 1 === currentDate) {
                dif_day = 'Yesterday';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]} ${pick.getHours()}:${pick.getMinutes()}`;
            } else if (pickDate + 1 === currentDate) {
                dif_day = 'Tomorrow';
                stringDate = `${dif_day} ${pickDate} ${monthNames[pickMonth]} ${pick.getHours()}:${pick.getMinutes()}`;
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


    return (
        <TouchableRipple key={index} style={{backgroundColor: theme.colors.background, margin: 8, borderRadius: 10, borderWidth: 1, borderColor: MD2Colors.grey300}} 
            onPress={() => navigation.navigate(routes.OrderStatusScreen, { item: item, status: status })}>
            <View style={{ padding: 8, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ gap: 2 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.storename}</Text>
                        <Text style={{ fontSize: 14 }}>order no. - {item.order_id}</Text>
                        <Text style={{ fontSize: 12, opacity: 0.6 }}>{dateFormated(item.order_date)}</Text>
                    </View>
                    <View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons size={18} name="currency-inr" />
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{totalPrice + item.service_fee}</Text>
                            </View>
                            <Text style={{ color: 'white', backgroundColor: statusColor, fontWeight: 'bold', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 100 }}>{item.order_status}</Text>
                        </View>
                    </View>
                </View>
                <Divider />
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {
                        status.map((status, index) => {
                            if (isStatusOver) {
                                opacity = 0.2;
                            }
                            if (item.order_status === status.tag) {
                                isStatusOver = true;
                            }
                            return (
                                <View key={index} style={{ flex: 1, alignItems: 'center', gap: 5, opacity: opacity }}>
                                    <Image style={{ width: 25, height: 25 }} source={{ uri: server.baseUrl+status.icon}} />
                                    <Text style={{ fontSize: 11 }}>{status.tag}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </TouchableRipple>
    )
}

export default ItemOrder