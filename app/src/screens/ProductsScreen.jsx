import { View, AppState, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  Tabs,
  TabScreen,
  TabsProvider,
} from "react-native-paper-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  useTheme,
  Text,
  Button,
  Snackbar,
} from "react-native-paper";
// import BottomSheet from 'reanimated-bottom-sheet';
import { Entypo, AntDesign, MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { routes } from "../Constaints";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, cleanProduct } from "../utils/reducers/ProductReducer";
import Loader from "../components/Loader";
import axios from "axios";

import { api } from "../Constaints";
import { cleanCart } from "../utils/reducers/CartReducer";
import getDistance from "../utils/getDistance";

const ClothsScreen = ({ navigation }) => {
  const route = useRoute();
  const {service} = route.params;
  const [ message, setMessage ] = useState('');
  const [ snackBar, setSnackbar ] = useState(false);
  const cart = useSelector((state) => state.cart.cart);
  const [ loader, setLoader ] = useState(false);
  // const total = cart.map((item) => item.quantity * item.price).reduce((curr,prev) => curr + prev,0);
  const [ totalPrice, setTotalPrice ] = useState(0);
  const theme = useTheme();
  const [ distance, setDistance ] = useState('...');
  // const [ currentLatLon, setCurrentLatLon ] = useState({});
  // const [  ]

  // const [ shop, setShop ] = useState();

  const {shop} = route.params;
  const currentLatLon = route.params.latlon;
  // const [products, setProducts] = useState(products_data);

  const server = useSelector(state => state.path.path);

  const products = useSelector((state) => state.product.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!currentLatLon){
      setDistance('please enable location');
      return;
    }
    const distanceinMeter = getDistance(currentLatLon, shop.latlon);
    let distance = '...';
    if(distanceinMeter > 1){
      distance = distanceinMeter.toFixed(2) + ' km';
      console.log(distanceinMeter.toFixed(2));
      console.log(shop.distance);
      if(distanceinMeter.toFixed(2) > shop.distance){
        Alert.alert(
          'Service Availbale',
          'Service not available on this area',
          [
            {
              text: 'ok',
              onPress: () => navigation.goBack(),
              style: 'ok',
            },
          ],
          {
            cancelable: false,
          }
        )

      }

    }else{
      distance = (distanceinMeter * 1000).toFixed(0) + ' m';
    }

    setDistance(distance);

  }, [])

  function getCloths(){
    dispatch(cleanProduct());
    dispatch(cleanCart());
      setLoader(true);
      // const uid = auth.currentUser.uid;
      // if(auth.currentUser == null) return;
      axios.get(`${server.baseUrl}/${api.products}/${shop._id}`, {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
      .then((result, err) => {
        setLoader(false);
        const {status, data} = result.data;
        if(status){
            // setShops([...data]);
            // console.log(data);
            [...data].map(item => dispatch(getProducts(item)));
        }
      }).catch(err => {
        setLoader(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }

  useEffect(() => {
    getCloths();
  }, []);


  useEffect(() =>{ 
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
   },[cart]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header Start */}
      <View
        style={{
          // marginTop: 20,
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity
          style={{ padding: 5, borderRadius: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-thin-left" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 5, borderRadius: 100, opacity:0 }}
          onPress={() => { }}
        >
          <AntDesign name="search1" size={24} />
        </TouchableOpacity>
      </View>
      {/* Header End */}

      <View
        style={{ marginStart: 15, paddingHorizontal: 10, paddingVertical: 5 }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{ shop.name }</Text>
        <View
          style={{
            // backgroundColor: 'red'
            marginEnd: 70,
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Entypo style={{ opacity: 0.5 }} size={18} name="location-pin" />
          <Text style={{ opacity: 0.5, fontSize: 18 }}>{distance}</Text>
          <Entypo
            style={{ opacity: 0.5 }}
            color={theme.colors.primary}
            name="flow-line"
          />
          <Text style={{ opacity: 0.5, fontSize: 16 }}>{shop.address}</Text>
        </View>
      </View>

      <TabsProvider defaultIndex={0}>
        <Tabs
          showLeadingSpace={false}
          mode="scrollable"
          style={{ backgroundColor: theme.colors.background, marginTop: 10 }}
        >
          <TabScreen label={"MAN"}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={products.filter((item) => item.gender === "men")}
                renderItem={({ item, index }) => <ProductItem item={item} cart={cart} index={index} service={service} setSnackbar={setSnackbar} setMessage={setMessage}/>}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TabScreen>
          <TabScreen label={"WOMAN"}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={products.filter((item) => item.gender === "women")}
                renderItem={({ item, index }) =><ProductItem item={item} cart={cart} index={index} service={service} setSnackbar={setSnackbar} setMessage={setMessage}/>}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TabScreen>
          <TabScreen label={"KIDS"}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={products.filter((item) => item.gender === "kids")}
                renderItem={({ item, index }) =><ProductItem cart={cart} item={item} index={index} service={service} setSnackbar={setSnackbar} setMessage={setMessage}/>}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TabScreen>
          <TabScreen label={"OTHERS"}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={products.filter((item) => item.gender === "other")}
                renderItem={({ item, index }) => <ProductItem cart={cart} item={item} index={index} service={service} setSnackbar={setSnackbar} setMessage={setMessage}/>}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TabScreen>
        </Tabs>
      </TabsProvider>

      { totalPrice === 0  ? null :
      <View style={{backgroundColor: theme.colors.primary, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="shopping-cart" size={25} color={'white'}/>
          <Text style={{color: 'white', fontSize: 18, marginStart: 10}}>{cart.length} items</Text>
          <Entypo size={18}
            color={'white'}
            name="flow-line"
          />
          <MaterialCommunityIcons color={'white'} size={18} name="currency-inr" />
            <Text style={{color: 'white', fontSize: 18}}>{totalPrice}</Text>
        </View>
        <Button onPress={() => navigation.navigate(routes.CartScreen, { shop: shop, shopname: shop.name, shopid: shop._id })} mode="elevated" buttonColor="white" style={{borderRadius: 100}}>View Cart</Button>
      </View>}


      <Loader loader={loader} setLoader={setLoader}/>


      {/* SnackBar */}
      <Snackbar
            style={{ position: 'fixed', bottom: 0, left: 0}}
                visible={snackBar}
                onDismiss={() => setSnackbar(false)}
                action={{
                    
                    label: 'X',
                    onPress: () => {
                        setSnackbar(false)
                    },
                }}>
                {message}
            </Snackbar>

    </SafeAreaView>
  );
};

export default ClothsScreen;





