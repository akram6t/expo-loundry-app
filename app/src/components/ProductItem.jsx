import { View, Text, Image, TouchableOpacity, AppState } from 'react-native';
import { MD2Colors, useTheme, Button, Portal, Dialog, Checkbox } from "react-native-paper";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart,
    decrementQuantity,
    incrementQuantity,
    addServices
} from "./../utils/reducers/CartReducer";
import { decrementQty, incrementQty } from "./../utils/reducers/ProductReducer";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ImageIdentifier } from '../utils/ImageIdentifier';

export default ProductItem = ({ item, index, service, setSnackbar, setMessage, cart }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [servicesData, setServicesData] = useState([]);
    const [serviceDialog, setServiceDialog] = useState(false);

    const server = useSelector(state => state.path.path);

    const addItemToCart = () => {
        dispatch(addToCart({ ...item, services: servicesData })); // cart
        dispatch(incrementQty({ ...item, services: servicesData })); // product
    };
    
    useEffect(() => {
        let servicematch = false;
        item.services.find(item => {
            if (item.name === service) {
                setServicesData([{ ...item }])
                servicematch = true;
                return;
            }
        });
        if(!servicematch){
            setServicesData([{...item.services[0]}]);
        }
    }, []);


    // const [price, setPrice] = useState(0);
    // const price = servicesData.reduce((total, service) => total + service.price, 0);

    useEffect(() => {
        dispatch(
        addServices({ _id: item._id, services: [...servicesData] }))
    },[servicesData]);


// on Screen state change
    // useEffect(() => {
            // cart.find(services => {
                // if (services._id === item._id) {
                    // console.log(services);
                    // console.log(services.services);
                    // setServicesData([services]);
                // }
            // });
    // }, [cart]);

     // Set an initial value of 0

    const handleCheckboxChange = (selectedService, allServices) => {
        setServicesData((prevServices) => {
            // Check if the selected service is already in the state
            const serviceIndex = prevServices.findIndex((service) => service.name === selectedService.name);

            if (serviceIndex !== -1) {
                if (prevServices.length === 1) {
                    setMessage('Minimum 1 service must be selected.')
                    setSnackbar(true);
                    return prevServices;
                }
                let updatedServices = [...prevServices];

                // If the service is in the state, remove it
                updatedServices.splice(serviceIndex, 1);
                return updatedServices;
            } else {  // ADD OR REMOVE ITEM

                // let updatedServices = [...prevServices];

                // if (selectedService.name === 'Wash Only') {
                //         updatedServices = updatedServices.filter(service => service.name !== 'Wash & Iron');
                //         upService = [...updatedServices, selectedService];

                // } else if (selectedService.name === 'Iron Only') {
                    
                //         updatedServices = updatedServices.filter(service => service.name !== 'Wash & Iron');
                //         upService = [...updatedServices, selectedService];
                //     // }

                // } else if (selectedService.name === 'Wash & Iron') {
                //     // If 'Wash & Iron' is selected, remove 'Wash Only' and 'Iron Only'
                //     updatedServices = updatedServices.filter(service => service.name !== 'Wash Only' && service.name !== 'Iron Only');
                //     upService = [...updatedServices, selectedService];
                // }

                // If the service is not in the state, add it
                return [...prevServices, selectedService];
            }
        });
    };

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                padding: 10,
                marginHorizontal: 8,
                marginVertical: 3,
                borderRadius: 8,
                marginTop: index === 0 ? 20 : 3,
                borderBottomWidth: 1,
                borderBottomColor: MD2Colors.grey200
            }}
        >
            <Image
                source={{ uri: ImageIdentifier(item.image, server) }}
                style={{ width: 70, height: 70 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
                {/* <View
                    style={{
                        flexDirection: "row",
                        marginTop: 2,
                        gap: 0,
                        alignItems: "center",
                    }}
                >
                    <MaterialCommunityIcons size={20} name="currency-inr" />
                    <Text style={{ fontSize: 16 }}>{price}</Text>
                </View> */}
                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setServiceDialog(true)}>
                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', padding: 8, borderRadius: 25, backgroundColor: theme.colors.primaryLight }}>
                            <View>
                                {
                                    servicesData.map((item, index) => (
                                        <Text key={index}>{item.name}</Text>
                                    ))
                                }
                            </View>
                            <Entypo name="chevron-down" color={theme.colors.primary} size={18} />
                        </View>
                    </TouchableOpacity>
                    {
                        cart.some((c) => c._id === item._id) ?
                            (<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', padding: 8, borderRadius: 100, backgroundColor: theme.colors.primaryLight }}>
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
                            </View>)
                            :
                            (<Button mode="contained" style={{ borderRadius: 100 }} onPress={() => addItemToCart()}>Add</Button>)
                    }
                </View>
            </View>

            <Portal>
                <Dialog visible={serviceDialog} onDismiss={() => setServiceDialog(false)}>
                    <View>
                        {item.services.map((service, index) => {
                            let c = false;
                            servicesData.map(item => {
                                if (service.name === item.name) {
                                    c = true;
                                }
                            })
                            return (
                                <View key={index} style={{ flexDirection: 'row' }}>
                                    {/* <View style={{ flexDirection: 'row', marginStart: 10, alignItems: 'center' }}>
                                        <MaterialCommunityIcons size={18} color={theme.colors.primary} name='currency-inr' />
                                        <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>{service.price}</Text>
                                    </View> */}
                                    <View style={{ flex: 1 }}>
                                        <Checkbox.Item
                                        color={theme.colors.primary}
                                            label={service.name}
                                            status={c ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxChange(service, item.services)}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </Dialog>
            </Portal>

        </View>
    );
};