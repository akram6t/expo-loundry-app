import { StyleSheet, View, Image, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Asset, useAssets } from 'expo-asset';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Appbar, Badge, Text, Avatar, TouchableRipple, Snackbar, BottomNavigation, MD2Colors } from 'react-native-paper'
import { SliderBox } from 'react-native-image-slider-box';
import axios from 'axios';
import { api, routes } from '../../Constaints';
import { auth } from './../../firebaseConfig';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../components/Loader';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: '...',
    email: '...',
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [unread, setunread] = useState(1);
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [shops, setShops] = useState([]);


  const theme = useTheme();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    apiFetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // const [assets, error] = useAssets([require('assets/images/icons_user.png')]);

  function apiFetch (){

  function getUser() {
    setLoader(true);
    const uid = auth.currentUser.uid;
    if (auth.currentUser == null) return;
    axios.get(`${api.baseUrl}/${api.users}/${uid}`, { headers: { "Content-Type": 'application/json' } })
      .then((result, err) => {
        setLoader(false);
        const { status, data } = result.data;
        if (status) {
          if (data == null) {
            getUser();
          } else {
            setUser(data);
          }
        }
      }).catch(err => {
        setLoader(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }


  function getBanners() {
    setLoader(true);
    // const uid = auth.currentUser.uid;
    if (auth.currentUser == null) return;
    axios.get(`${api.baseUrl}/${api.banners}`, { headers: { "Content-Type": 'application/json' } })
      .then((result, err) => {
        setLoader(false);
        const { status, data } = result.data;
        if (status) {
          const images = data.map(obj => obj.image)
          setBanners(images);
        }
      }).catch(err => {
        setLoader(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }

  function getServices() {
    setLoader(true);
    // const uid = auth.currentUser.uid;
    if (auth.currentUser == null) return;
    axios.get(`${api.baseUrl}/${api.services}`, { headers: { "Content-Type": 'application/json' } })
      .then((result, err) => {
        setLoader(false);
        const { status, data } = result.data;
        if (status) {
          setServices([...data]);
        }
      }).catch(err => {
        setLoader(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }

  function getShops() {
    setLoader(true);
    // const uid = auth.currentUser.uid;
    if (auth.currentUser == null) return;
    axios.get(`${api.baseUrl}/${api.shops}`, { headers: { "Content-Type": 'application/json' } })
      .then((result, err) => {
        setLoader(false);
        const { status, data } = result.data;
        if (status) {
          setShops([...data]);
          console.log(data);
        }
      }).catch(err => {
        setLoader(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }

      Promise.all([getUser(), getBanners(), getServices(), getShops()]);

}

  useEffect(() => {
    apiFetch();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16 }}>hello</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }} numberOfLines={1}>{user.name.length > 15 ? user.name.slice(0, 15) : user.name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
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
            {user.profile ? (<Avatar.Image style={{ marginStart: 8, marginEnd: 8 }} size={40} source={{ uri: user.profile }} />)
              : (<Avatar.Image style={{ marginStart: 8, marginEnd: 8 }} size={40} source={require('../../assets/images/icon_user.png')} />)}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} overScrollMode='never' style={{ flex: 1 }}>

        <View style={{ marginTop: 20 }}>
          <SliderBox
            images={banners}
            autoPlay
            circleLoop
            dotColor={theme.colors.primary}
            inactiveDotColor={theme.colors.background}
            ImageComponentStyle={{
              borderRadius: 6,
              width: "94%",
            }}
          />
        </View>

        {/* Services */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginStart: 12, fontSize: 18 }}>Services</Text>
          <FlatList scrollEnabled={false}
            contentContainerStyle={{ padding: 10 }}
            data={services}
            renderItem={({ item, index }) => (
              <TouchableRipple style={{
                width: 130,
                flex: 1,
                // backgroundColor: 'white',
                backgroundColor: item.bgColor,
                margin: 8,
                paddingHorizontal: 10,
                paddingVertical: 20,
                elevation: 5,
                borderRadius: 8
              }} key={index} onPress={() => navigation.navigate(routes.ClothsScreen, { service: item.name, shop: shops[0] })}>
                <View style={{
                  alignItems: 'center',
                  gap: 10,
                }} >
                  <Image style={{ width: 70, height: 70 }} source={{ uri: item.image }} />
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                </View>
              </TouchableRipple>
            )}
            //Setting the number of column
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

      </ScrollView>

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

const services = [
  {
    image: "https://cdn-icons-png.flaticon.com/128/3003/3003984.png",
    name: "Wash Only",
    bgColor: '#FEFFEC'
  },
  {
    image: "https://cdn-icons-png.flaticon.com/128/9753/9753675.png",
    name: "Iron Only",
    bgColor: '#EBFFEC'
  },
  {
    image: "https://cdn-icons-png.flaticon.com/128/2975/2975175.png",
    name: "Wash & Iron",
    bgColor: '#EDEAFF'
  },
  {
    image: "https://cdn-icons-png.flaticon.com/128/995/995016.png",
    name: "Dry Clean",
    bgColor: '#EFFEFF'
  },
];