import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, MD2Colors, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { routes } from "../Constaints";
import CartItem from "../components/CartItem";
import { useSelector, useDispatch } from 'react-redux';
import { cleanCart } from "../utils/reducers/CartReducer";
import { quantityReset } from "../utils/reducers/ProductReducer";
import { useRoute } from "@react-navigation/native";

const CartScreen = ({ navigation }) => {
    const theme = useTheme();
    const route = useRoute();
    const dispatch = useDispatch();
    const { shop, shopname, shopid } = route.params;
    const cart = useSelector((state) => state.cart.cart);

    const [totalPrice, setTotalPrice] = useState(0);


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
                <Text style={{ fontSize: 20 }}>Your Cart</Text>
            </View>
            {/* Appbat End */}

            {totalPrice === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, marginBottom: 20 }}>Cart is empty</Text>
                    <Button onPress={() => navigation.goBack()}>go back</Button>
                </View>
            )

                : (<ScrollView overScrollMode="never" contentContainerStyle={{ backgroundColor: '#f3f3f3', justifyContent: 'space-between' }}>
                    {/* contentContainerStyle={{minHeight: Dimensions.get("window").height - 150, justifyContent: 'space-between' }}> */}
                    {/* Your Cloths */}
                    <View style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}>
                        <View style={{ paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginTop: 10, color: theme.colors.primary }}>YOUR CLOTHES</Text>
                            <Button onPress={() => {
                                dispatch(cleanCart());
                                dispatch(quantityReset());
                            }}>clear</Button>
                        </View>
                        <FlatList
                            scrollEnabled={false}
                            contentContainerStyle={{
                                margin: 10,
                                padding: 10,
                                gap: 5,
                                borderWidth: 1,
                                borderColor: MD2Colors.grey300,
                                borderRadius: 10,
                            }}
                            data={cart}
                            renderItem={({ item, index }) => <CartItem item={item} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    {/* <View style={{ height: 20, backgroundColor: '#f3f3f3' }}></View> */}
                    {/* End Your Cloths */}

                </ScrollView>
                )}
            {totalPrice === 0 ? null
                :
                (<View>
                    <Text style={{ marginStart: 18, marginTop: 10 + 2, color: theme.colors.primary }}>PAYMENT INFO</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: 1,
                            borderColor: MD2Colors.grey200,
                            padding: 5,
                            margin: 10,
                        }}
                    >
                        <Text style={{
                            fontWeight: 'bold', fontSize: 18
                        }}>Total</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 2,
                                gap: 0,
                                alignItems: "center",
                            }}
                        >
                            <MaterialCommunityIcons size={20} color={theme.colors.primary} name="currency-inr" />
                            <Text style={{ fontSize: 20, color: theme.colors.primary, fontWeight: 'bold' }}>{totalPrice}</Text>
                        </View>

                    </View>
                </View>
                )}

            {totalPrice === 0 ? null : <Button contentStyle={{ padding: 5 }}
                style={{ fontSize: 20, margin: 8 }}
                onPress={() => navigation.navigate(routes.PickupDropScreen, { shop: shop, shopname: shopname, shopid: shopid })}
                mode="contained"
            >
                Continue
            </Button>
            }


        </SafeAreaView>
    );
};

export default CartScreen;
