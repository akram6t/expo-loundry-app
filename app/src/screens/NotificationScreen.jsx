
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, MD2Colors, Button, TouchableRipple, useTheme, Snackbar } from 'react-native-paper';
import { } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ImageIdentifier from './../utils/ImageIdentifier';
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { formatDate } from './../utils/FormatDate';
import { formatTime } from './../utils/FormatTime';
import { api } from '../Constaints';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import Loader from '../components/Loader';

const NotificationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [listEnd, setListEnd] = useState(false);
  const server = useSelector(state => state.path.path);

  const [notificationsList, setNotificationsList] = useState([]);


  function getNotifications() {
    setLoading(true);
    const uid = auth.currentUser.uid;
    axios.get(`${server.baseUrl}/${api.notifications}/${uid}?skip=${skip}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
      .then((result, err) => {
        setLoading(false);
        const { status, data } = result.data;
        if (status) {
          setSkip(skip + 10);
          setNotificationsList([...notificationsList, ...data]);
          if (data.length < 10) {
            setListEnd(true);
          }
        }
      }).catch(err => {
        setLoading(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }


  useEffect(() => {
    Promise.all([getNotifications()]);
  }, []);


  const onRefresh = React.useCallback(() => {
    setListEnd(false);
    setSkip(0);
    setNotificationsList([]);
    setRefreshing(true);
    Promise.all([getNotifications()]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const removeNotification = (item) => {
    setLoading(true);
    axios.post(`${server.baseUrl}/${api.remove_notification}`, { _id: item._id }, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
      .then((result, err) => {
        setLoading(false);
        const { status, message } = result.data;
        if (status) {
          setNotificationsList([...notificationsList.filter(it => it._id !== item._id)]);
        }
      }).catch(err => {
        setLoading(false);
        setMessage(`${err}`);
        setSnackbar(true);
        console.log(err);
      })
  }



  function NotificationItem({ item, server }) {
    const [ status, setStatus ] = useState(item.status);
    const title = item.title;
    const message = item.message;


    const readNotification = () => {
      axios.post(`${server.baseUrl}/${api.notification_status}`, { _id: item._id }, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
        .then((result, err) => {
          const { status, message } = result.data;
          if (status) {
            
          }
        }).catch(err => {
          // setMessage(`${err}`);
          // setSnackbar(true);
          console.log(err);
        })
    }

    useEffect(() => {
      if( item.status === 'unread'){
        Promise.all([readNotification()]);
      }
    }, []);


    return (
      <View style={{ opacity: status === 'read' ? 0.6 : 0.9, margin: 5, borderRadius: 10, borderWidth: 1, borderColor: MD2Colors.grey300, paddingHorizontal: 5, paddingVertical: 8, backgroundColor: item.color ? item.color + '2A' : 'white', flexDirection: 'row', justifyContent: 'space-between' }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <Image style={{ width: 50, height: 50 }} source={!item.icon ? require('./../../assets/images/forground_logo.png') : { uri: item.icon.startsWith('http') ? item.icon : (server.baseUrl + item.icon) }} />
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold'}} numberOfLines={1}>{title}</Text>
            <Text numberOfLines={3}>{message}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => removeNotification(item)}>
            <MaterialIcons name='clear' size={25} color={MD2Colors.grey500} />
          </TouchableOpacity>
          <Text>{formatDate(item.date)} {formatTime(item.date)}</Text>
        </View>

      </View>
    )
  }





  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={MD2Colors.grey200} />

      <SafeAreaView style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
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
          <Text style={{ fontSize: 20 }}>Notifications</Text>
        </View>

        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

          <FlatList
            scrollEnabled={false}
            overScrollMode="never"
            data={notificationsList}
            renderItem={({ item, index }) => {

              return (
                <NotificationItem server={server} item={item} index={index} />
              )
            }}
            keyExtractor={(item, index) => index.toString()} />
          <Button disabled={listEnd} onPress={() => getNotifications()} loading={loading}>{!listEnd ? 'load more' : 'No notifications available'}</Button>

        </ScrollView>

        <Loader loader={loading} setLoader={setLoading} />

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
    </View>
  )
}

export default NotificationScreen

// const sampleNotifications = [
  // {
    // _id: '6544aebcb8e7b5ebbd1a9cbe',
    // icon: '/icons/icon_order_delivered.png',
    // title: '0013',
    // message: 'Delivered',
    // date: new Date().toISOString(),
    // color: '#008451',
    // type: 'order',
    // uid: '',
    // status: 'unread'
  // },
  // {
    // _id: '6544aebcb8e7b5ebbd1a9cbe',
    // icon: '/icons/icon_order_shipped.png',
    // title: '0023',
    // message: 'Delivered',
    // date: new Date().toISOString(),
    // color: '#500085',
    // type: 'order',
    // uid: '',
    // status: 'unread'
  // },
  // {
    // _id: '6544aebcb8e7b5ebbd1a9cbe',
    // icon: '/icons/icon_order_shipped.png',
    // title: '0023',
    // message: 'Delivered',
    // date: new Date().toISOString(),
    // color: '#500085',
    // type: 'order',
    // uid: '',
    // status: 'read'
  // },
  // {
    // _id: '6544aebcb8e7b5ebbd1a9cbe',
    // icon: '/icons/icon_order_shipped.png',
    // title: '0023',
    // message: 'earn now',
    // date: new Date().toISOString(),
    // color: '#500085',
    // type: 'order',
    // uid: '',
    // status: 'read'
  // }
// ]