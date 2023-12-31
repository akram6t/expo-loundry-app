import { StyleSheet, View, Image, FlatList, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
// import { Asset, useAssets } from 'expo-asset';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Appbar, Badge, Text, Avatar, TouchableRipple, Snackbar, BottomNavigation, MD2Colors, Button, Divider } from 'react-native-paper'
import Carousel from './../components/Carousel';
import axios from 'axios';
import { api, routes } from '../Constaints';
import { auth } from '../firebaseConfig';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../components/Loader';
import { setDatabaseData, setPath } from '../utils/reducers/DatabaseReducer';
import { useDispatch, useSelector } from 'react-redux';
import { database } from './../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import * as Location from 'expo-location';
import { ImageIdentifier } from '../utils/ImageIdentifier';
import { useFocusEffect } from '@react-navigation/native';
import { getNotificationToken } from '../utils/notification/getToken';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [user, setUser] = useState({
    name: '...',
    email: '...',
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [unread, setunread] = useState(0);
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [shops, setShops] = useState([]);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);

  const [currentLatLon, setCurrentLatLon] = useState(null);

  const [address, setAddress] = useState('loading ...');

  const dispatch = useDispatch();


  const server = useSelector(state => state.path.path);

  // console.log(server.baseUrl);
  // const [assets, error] = useAssets([require('assets/images/icons_user.png')]);

  function apiFetch() {

    function getUser() {
      if (auth.currentUser == null) return;
      setLoader(true);
      const uid = auth.currentUser.uid;
      axios.get(`${server.baseUrl}/${api.users}/${uid}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
        .then((result, err) => {
          setLoader(false);
          const { status, data } = result.data;
          if (status) {
            console.log('get user...');
            if (data == null) {
              getUser();
            } else {
              setUser(data);
            }
          }
        }).catch(err => {
          setLoader(false);
          // setMessage(`${err}`);
          // setSnackbar(true);
          console.log(err);
        })
    }


    function getBanners() {
      if (auth.currentUser == null) return;
      setLoader(true);
      // const uid = auth.currentUser.uid;
      axios.get(`${server.baseUrl}/${api.banners}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
        .then((result, err) => {
          setLoader(false);
          const { status, data } = result.data;
          if (status) {
            const images = data.map(obj => obj.image)
            setBanners(images);
            console.log('get banners...');
          }
        }).catch(err => {
          setLoader(false);
          // setMessage(`${err}`);
          // setSnackbar(true);
          console.log(err);
        })
    }

    function getServices() {
      if (auth.currentUser == null) return;
      setLoader(true);
      // const uid = auth.currentUser.uid;
      axios.get(`${server.baseUrl}/${api.services}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
        .then((result, err) => {
          setLoader(false);
          const { status, data } = result.data;
          if (status) {
            setServices([...data]);
            console.log('get services...');
          }
        }).catch(err => {
          setLoader(false);
          // setMessage(`${err}`);
          // setSnackbar(true);
          console.log(err);
        })
    }

    function getShops() {
      if (auth.currentUser == null) return;
      setLoader(true);
      // const uid = auth.currentUser.uid;
      axios.get(`${server.baseUrl}/${api.shops}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
        .then((result, err) => {
          setLoader(false);
          const { status, data } = result.data;
          if (status) {
            setShops([...data]);
            console.log('get shops...');
            // console.log(data);
          }
        }).catch(err => {
          setLoader(false);
          // setMessage(`${err}`);
          // setSnackbar(true);
          console.log(err);
        })
    }

    Promise.all([getUser(), getBanners(), getServices(), getShops()]);

  }

  function getNotificationsCount() {
    if (auth.currentUser == null) return;
    // const uid = auth.currentUser.uid;
    axios.get(`${server.baseUrl}/${api.notification_COUNTS}/${auth.currentUser.uid}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
      .then((result, err) => {
        const { status, data } = result.data;
        if (status) {
          setunread(typeof data === 'string' ? parseInt(data) : data);
          console.log('notifications count: '+data);
        }
      }).catch(err => {
        // setMessage(`${err}`);
        // setSnackbar(true);
        console.log(err);
      })
  }

  
  useFocusEffect(
    useCallback(() => {

        getNotificationsCount();

        return () => {
            // console.log(' unfocused');
        };
    }, [])
);



  // Location service enable
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      checkIfLocationEnabled();
      // Alert.alert(
      //     "Location services not enabled",
      //     "Please enable the location services",
      //     [
      //         {
      //             text: "Cancel",
      //             onPress: () => console.log("Cancel Pressed"),
      //             style: "cancel",
      //         },
      //         { text: "OK", onPress: () => console.log("OK Pressed") },
      //     ],
      //     { cancelable: false }
      // );
    } else {
      setLocationServicesEnabled(enabled);
      getCurrentLocation();
    }
    getCurrentLocation();
  };

  // get location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationServicesEnabled(false);
    }

    // setLoader(true);
    const { coords } = await Location.getCurrentPositionAsync();
    // console.log(coords)
    if (coords) {
      const { latitude, longitude } = coords;
      setCurrentLatLon({
        latitude: latitude,
        longitude: longitude
      })

      let res = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      // setLoader(false);

      // setAddress('gita nagar');

      const response = res[0];

      setAddress(`${response.name ? response.name + ', ' : ''}${response.streetNumber ? response.streetNumber + ', ' : ''}${response.street ? response.street + ', ' : ''}${response.district ? response.district + ', ' : ''}${response.city ? response.city + ', ' : ''}${response.region ? response.region + ', ' : ''}${response.postalCode ? response.postalCode : ''} `);
    }
  };

  useEffect(() => {
    // if (server.baseUrl === '') {
      // setLoader(true);
    // } else {
      // console.log(server.baseUrl);
      // setLoader(false);
      checkIfLocationEnabled();
      getCurrentLocation();
      apiFetch();
      Promise.all([ getNotificationsCount() ])
    // }
  }, []);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkIfLocationEnabled();
    apiFetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={{ paddingHorizontal: 8, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }} numberOfLines={1}>{user.name}</Text>
          <Text numberOfLines={1} style={{ fontSize: 16 }}>{address}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate(routes.NotificationsScreen)}>
            <Badge
              visible={unread && unread > 0}
              size={16}
              style={{ position: 'absolute', top: 5, right: 5 }}
            >
              {unread}
            </Badge>
            <Appbar.Action
              icon={unread ? 'bell' : 'bell-outline'}
              accessibilityLabel="TagChat"
            // onPress={() => history.push('/notes')}
            // {...commonProps}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(routes.ProfileScreen)}>
            <Avatar.Image style={{ marginStart: 8, marginEnd: 8 }} size={40} source={user.profile ? { uri: ImageIdentifier(user.profile, server) } : require('../../assets/images/icon_user.png')} />
          </TouchableOpacity>
        </View>
      </View>
      {/* appbar end */}

      {/* <Button onPress={() => getAddFromLatLon()}>getlatlon</Button> */}

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} overScrollMode='never' style={{ flex: 1 }}>

        {/* Services */}
        <View style={{ marginTop: 20, flex: 1 }}>
          <Text style={{ marginStart: 12, fontSize: 16, color: theme.colors.primary }}>SERVICES</Text>
          <FlatList scrollEnabled={false}
            contentContainerStyle={{ padding: 10 }}
            data={services}
            renderItem={({ item, index }) => {
              return <TouchableRipple style={{
                width: 130,
                flex: 1,
                // backgroundColor: 'white',
                backgroundColor: item.color,
                margin: 8,
                paddingHorizontal: 10,
                paddingVertical: 20,
                elevation: 5,
                borderRadius: 8
              }} key={index} onPress={() => navigation.navigate(routes.ClothsScreen, { service: item.name, shop: shops[0], latlon: currentLatLon })}>
                <View style={{
                  alignItems: 'center',
                  gap: 10,
                }} >
                  <Image style={{ width: 70, height: 70 }} source={{uri: ImageIdentifier(item.image, server)}} />
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                </View>
              </TouchableRipple>
            }}
            //Setting the number of column
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <Divider />
        {/* Carousel */}
        <Carousel images={banners.map(img => ImageIdentifier(img, server))} />

      </ScrollView>

      {/* check Location enabled */}
      {/* {
        !locationServicesEnabled ? (
          <View style={{ padding: 5, elevation: 3, margin: 8, borderRadius: 20, backgroundColor: theme.colors.primaryLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{marginStart: 8, fontSize: 16, fontWeight: 'bold' }}>Please enable the location</Text>
            <Button onPress={() => { checkIfLocationEnabled(); getCurrentLocation(); }}>enable</Button>
          </View>
        ) : null
      } */}
      <View>

      </View>

      {/* Bottom Navigation View */}
      <View style={{ flexDirection: 'row', borderTopColor: MD2Colors.grey300, borderTopWidth: 1 }}>
        <TouchableRipple onPress={() => { }} style={{ flex: 1, padding: 12 }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <MaterialCommunityIcons name='home' size={24} color={theme.colors.primary} />
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: 16 }}>Home</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate(routes.OrdersScreen)} style={{ flex: 1, alignItems: 'center', padding: 12 }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Feather name='box' size={24} />
            <Text style={{ fontSize: 16 }}>Orders</Text>
          </View>
        </TouchableRipple>
      </View>

      <Loader loader={loader} setLoader={setLoader} />

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
  )
}

export default HomeScreen


// const bottomRoutes = [
// { key: 'home', title: 'Home', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
// { key: 'profile', title: 'Recents', focusedIcon: 'history' },
// ];


// const images = [
//   "https://media.istockphoto.com/id/1247884083/vector/laundry-service-room-vector-illustration-washing-and-drying-machines-with-cleansers-on-shelf.jpg?s=612x612&w=0&k=20&c=myaNEKlqX7R--bzWGDoMI7PhdxG_zdQTKYEBlymJQGk=",
//   "https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=800",
// ];

