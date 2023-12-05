import { View, Text, TouchableOpacity } from 'react-native';
import { MD2Colors, useTheme, Button, Portal, Dialog, Checkbox } from "react-native-paper";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { decrementQty, incrementQty } from '../utils/reducers/ProductReducer';
import { decrementQuantity, incrementQuantity, addServices } from '../utils/reducers/CartReducer';
import { useState } from 'react';

export default CartItem = ({ item, index }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [serviceDialog, setServiceDialog] = useState(false);

    const servicesData = item.services;

    const price = item.services.reduce((total, service) => total + service.price, 0);


    const products = useSelector(state => state.product.product);
    let productServices = products.filter(p => p.id === item.id)[0].services;



    const handleCheckboxChange = (selectedService, allServices) => {
        // setServicesData((prevServices) => {
        const prevServices = [...servicesData];
        // Check if the selected service is already in the state
        const serviceIndex = prevServices.findIndex((service) => service.name === selectedService.name);

        if (serviceIndex !== -1) {
            if (prevServices.length === 1) {
                // setMessage('Minimum 1 service must be selected.')
                // setSnackbar(true);
                return prevServices;
            }
            let updatedServices = [...prevServices];

            // If the service is in the state, remove it
            updatedServices.splice(serviceIndex, 1);
            dispatch(
                addServices({ _id: item._id, services: [...updatedServices] })
            )
            // return updatedServices;
        } else {  // ADD ITEM

            // let updatedServices = [...prevServices];
            // let upService = [...updatedServices, selectedService];

            // if (selectedService.name === 'Wash Only') {
                // const serviceIndex = prevServices.findIndex((service) => service.name === 'Iron Only');
                // if (serviceIndex !== -1) {
                // updatedServices = updatedServices.filter(service => service.name !== 'Iron Only');

                // const ind = allServices.findIndex((service) => service.name === "Wash & Iron");
                // upService = [...updatedServices, allServices[ind]];
                // } else {
                // If 'Wash Only' is selected, remove 'Wash & Iron'
                // updatedServices = updatedServices.filter(service => service.name !== 'Wash & Iron');
                // upService = [...updatedServices, selectedService];

                // }

            // } else if (selectedService.name === 'Iron Only') {
                // If 'Iron Only' is selected, remove 'Wash & Iron'
                // const serviceIndex = prevServices.findIndex((service) => service.name === 'Wash Only');
                // if (serviceIndex !== -1) {
                // updatedServices = updatedServices.filter(service => service.name !== 'Wash Only');

                // const ind = allServices.findIndex((service) => service.name === "Wash & Iron");
                // upService = [...updatedServices, allServices[ind]];
                // } else {
                // updatedServices = updatedServices.filter(service => service.name !== 'Wash & Iron');
                // upService = [...updatedServices, selectedService];
                // }

            // } else if (selectedService.name === 'Wash & Iron') {
                // If 'Wash & Iron' is selected, remove 'Wash Only' and 'Iron Only'
                // updatedServices = updatedServices.filter(service => service.name !== 'Wash Only' && service.name !== 'Iron Only');
                // upService = [...updatedServices, selectedService];
            // }

            // If the service is not in the state, add it
            // return upService;
            dispatch(
                addServices({ _id: item._id, services: [...prevServices, selectedService] })
            )
        }
        // });
    };

    return (
        <View
            style={{
                gap: 5,
                padding: 5,
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
                <TouchableOpacity activeOpacity={0.7} onPress={() => setServiceDialog(true)}>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                            padding: 8,
                            borderRadius: 25,
                            backgroundColor: theme.colors.primaryLight,
                        }}
                    >
                        <View>
                            {
                                servicesData.map((item, index) => (
                                    <Text key={index}>{item.name}</Text>
                                ))
                            }
                        </View>
                        <Entypo
                            name="chevron-down"
                            color={theme.colors.primary}
                            size={18}
                        />
                    </View>
                </TouchableOpacity>
                <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                            padding: 8,
                            borderRadius: 100,
                            backgroundColor: theme.colors.primaryLight,
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            dispatch(decrementQuantity(item)); // cart
                            dispatch(decrementQty(item)); // product
                        }}>
                            <Entypo size={18} name="minus" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18 }}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => {
                            dispatch(incrementQuantity(item)); // cart
                            dispatch(incrementQty(item)); //product
                        }}>
                            <Entypo size={18} name="plus" />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 2,
                            gap: 0,
                            alignItems: "center",
                        }}
                    >
                        <MaterialCommunityIcons size={20} name="currency-inr" />
                        <Text style={{ fontSize: 16 }}>{price * item.quantity}</Text>
                    </View>
                </View>
            </View>


            <Portal>
                <Dialog visible={serviceDialog} onDismiss={() => setServiceDialog(false)}>
                    <View>
                        {productServices.map((service, index) => {
                            let c = false;
                            servicesData.map(item => {
                                if (service.name === item.name) {
                                    c = true;
                                }
                            })
                            return (
                                <View key={index} style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row', marginStart: 10, alignItems: 'center' }}>
                                        <MaterialCommunityIcons size={18} color={theme.colors.primary} name='currency-inr' />
                                        <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>{service.price}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Checkbox.Item
                                            color={theme.colors.primary}
                                            label={service.name}
                                            status={c ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxChange(service, productServices)}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </Dialog>
            </Portal>


        </View>
    )
}