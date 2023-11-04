import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useTheme, Card, Title, Portal, Button, Avatar, Dialog, TouchableRipple, Divider, List, TextInput, Snackbar } from 'react-native-paper';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import Loader from '../components/Loader';
import axios from 'axios';
import { api, routes } from '../../Constaints';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [ loader, setLoader ] = useState(false);
  const [ logOutDialog, setLogOutDialog ] = useState(false);
  const [ user, setUser ] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });

  const hideDialog = () => setVisible(false);

  const showDialog = () => setVisible(true);

  function getUser(){
    setLoader(true);
    const uid = auth.currentUser.uid;
    axios.get(`${api.baseUrl}/${api.users}/${uid}`, {headers: {"Content-Type": 'application/json'}})
    .then((result, err) => {
      setLoader(false);
      const {status, data} = result.data;
      if(status){
        if(data == null){
          getUser();
        }else{
          setUser(data);
        }
      }
    }).catch(err => {
      setMessage
      setLoader(false);
      setMessage(`${err}`);
      setSnackbar(true);
      console.log(err);
    })
   }


   useEffect(() => {
    getUser();
   }, []);

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
        <Text style={{ fontSize: 20 }}>My Profile</Text>
      </View>
      {/* Header End */}
      <ScrollView>
        {/* Profile Section */}
        <TouchableRipple onPress={() => showDialog()}>
          <View style={{ padding: 10, marginTop: 10, gap: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Avatar.Image size={100} source={require('../../assets/images/icon_user.png')} />
            <View style={{ gap: 5 }}>
              <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: 'bold' }}>{ user.name }</Text>
              <Text numberOfLines={1} style={{  }}>{ user.email }</Text>
              <Text style={{ }}>{user.mobile}</Text>
              <Text style={{ color: theme.colors.primary }}>Edit Profile</Text>
            </View>
            {/* <AntDesign name='right' style={{ marginEnd: 20 }} size={25} color={theme.colors.primary} /> */}
          </View>
        </TouchableRipple>
        {/* Profile Section End */}

        <Divider />

        <View style={{ marginTop: 20 }}>
          <List.Item onPress={() => navigation.navigate(routes.MyAddressesScreen)}
            title="Saved Addresses"
            left={props => <List.Icon {...props} icon="google-maps" />}
          // description="Item description"
          />
          <List.Item onPress={() => { }}
            title="Terms & Conditions"
            left={props => <List.Icon {...props} icon="book-check" />}
          // description="Item description"
          />
          <List.Item onPress={() => { }}
            title="Support"
            left={props => <List.Icon {...props} icon="chat-question" />}
          // description="Item description"
          />
          <List.Item onPress={() => setLogOutDialog(true)}
            title="Logout"
            left={props => <List.Icon {...props} icon="logout" />}
          // description="Item description"
          />
        </View>

        {/* Edit Profile */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <Dialog.Content>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center', gap: 10}}>
                <View style={{position: 'relative'}}>
                  <TouchableOpacity style={{zIndex: 1, position: 'absolute', right: 0, bottom: 0}} >
                    <MaterialCommunityIcons size={25} name='image-plus'/>
                  </TouchableOpacity>
                  <Avatar.Image size={90} source={(require('../../assets/images/icon_user.png'))}/>
                </View>
                <TextInput value={user.name} style={{width: '100%'}} mode='outlined' label={'Enter Name'}/>
                <TextInput value={user.email} style={{width: '100%'}} mode='outlined' label={'Enter Email'}/>
                <TextInput value={user.mobile} style={{width: '100%'}} mode='outlined' label={'Enter Mobile'}/>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode='text' onPress={hideDialog}>Cancel</Button>
              <Button mode='contained' onPress={hideDialog}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={logOutDialog} onDismiss={() => setLogOutDialog(false)}>

          <Dialog.Title>Logout</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to logout?</Text>
            </Dialog.Content>

            <Dialog.Actions>
              <Button onPress={() => setLogOutDialog(false)}>cancel</Button>
              <Button onPress={() => auth.signOut()}>logout</Button>
            </Dialog.Actions>

          </Dialog>
        </Portal>

        <Loader loader={loader} setLoader={setLoader}/>

        {/* <Snackbar> */}
          {/* {message} */}
        {/* </Snackbar> */}



      </ScrollView>

      
    </SafeAreaView>
  )
}

export default ProfileScreen
