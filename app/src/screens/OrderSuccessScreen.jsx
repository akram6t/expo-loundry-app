import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { routes } from "../Constaints";
import { BackHandler } from "react-native";

const OrderSuccessScreen = ({ navigation }) => {

  function resetScreen(){

    navigation.reset({
      index: 0,
      routes: [{ name: routes.HomeScreen }]
    })
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", resetScreen);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", resetScreen);
    };
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableOpacity
        style={{ padding: 5, marginStart: 10, marginTop: 10, borderRadius: 10 }}
        onPress={() => resetScreen()}
      >
        <Entypo name="chevron-thin-left" size={24} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Image
          style={{ borderRadius: 100 }}
          source={require("../../assets/images/gif_order_success.gif")}
        />
        <Text style={{ fontSize: 20 }}>Order has been Placed</Text>
        <Button
          style={{ marginTop: 50 }}
          onPress={() => resetScreen()}
          mode="text"
        >
          go back
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;
