import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useTheme, Portal, Button, Avatar, Dialog, TouchableRipple, Divider, List, TextInput, Snackbar } from 'react-native-paper';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import Loader from '../components/Loader';
import axios from 'axios';
import { api, routes } from '../Constaints';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageIdentifier } from '../utils/ImageIdentifier';

const ProfileScreen = ({ navigation }) => {
  const server = useSelector(state => state.path.path);
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [ loader, setLoader ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ snackbar, setSnackbar ] = useState(false);
  const [ logOutDialog, setLogOutDialog ] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ updateUser, setUpdateUser ] = useState({
    name: '',
    mobile: ''
  });
  const [ user, setUser ] = useState({
    name: '...',
    email: '...',
    mobile: '...',
    password: '...'
  });

  const handleUpdateUser = (name, value) => {
    if(name === 'mobile'){
      if(value.length > 10){
        return;
      }
    }
    if(name === 'name'){
      if(value.length > 20){
        return;
      }
    }
    setUpdateUser({
      ...updateUser,
      [name]:value
    })
  }

  const hideDialog = () => setVisible(false);

  const showDialog = () => setVisible(true);


  const submitUpdateUser = (data) => {
    setLoader(true);
    hideDialog();
    const uid = auth.currentUser.uid;
    axios.post(`${server.baseUrl}/${api.updateUser}`, {
      uid:uid,
      ...data
    }, {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
    .then((result, err) => {
      setLoader(false);
      const {status, message} = result.data;
      if(status){
        setSelectedImage(null);
        setMessage(message);
        setSnackbar(true);
        getUser();
      }
    }).catch(err => {
      setSelectedImage(null);
      setLoader(false);
      setMessage(`${err}`);
      setSnackbar(true);
      console.log(err);
    })
  }

  const handleUpdateUserSubmit = async () => {
    if(updateUser.name.trim() === ""){
      setMessage('name is empty please fill value...')
      setSnackbar(true);
      return;
    }
    if(updateUser.mobile.trim() === ""){
      setMessage('mobile is empty please fill value...')
      setSnackbar(true);
      return;
    }

    let jsonData = {
      ...updateUser
    }
    
    if(selectedImage){
        const compressedImage = await FileSystem.readAsStringAsync(selectedImage, {encoding: FileSystem.EncodingType.Base64});
        jsonData.profile = compressedImage;
    }

    submitUpdateUser(jsonData);

  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      // delete result.cancelled
      // setSelectedImage(result.assets[0].uri);

      const resizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 512, height: 512 } }],  
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setSelectedImage(resizedImage.uri);

    }
  };

  function getUser(){
    setLoader(true);
    const uid = auth.currentUser.uid;
    axios.get(`${server.baseUrl}/${api.users}/${uid}`, {headers: {"Content-Type": 'application/json', apikey: server.apikey}})
    .then((result, err) => {
      setLoader(false);
      const {status, data} = result.data;
      if(status){
        console.log('fgh');
        if(data == null){
          getUser();
        }else{
          setUser(data);

          setUpdateUser({
            name: data.name,
            mobile: data.mobile
          });

          // if(data.profile){
            
          // }
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

   const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Signout error:', error);
    }
   }

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
            <Avatar.Image size={100} source={user.profile ? {uri: ImageIdentifier(user.profile, server)} : require('../../assets/images/icon_user.png')} />
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
          <List.Item onPress={() => navigation.navigate(routes.TermsAndConditionsScreen)}
            title="Terms & Conditions"
            left={props => <List.Icon {...props} icon="book-check" />}
          // description="Item description"
          />
          <List.Item onPress={() => navigation.navigate(routes.SupportScreen)}
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
                  <TouchableOpacity onPress={() => pickImage()} style={{zIndex: 1, position: 'absolute', width: 90, height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                    <MaterialCommunityIcons color={'white'} size={50} name='plus'/>
                  </TouchableOpacity>
                  <Avatar.Image size={90} source={selectedImage ? { uri: selectedImage } : require('../../assets/images/icon_user.png')}/>
                </View>
                <TextInput value={updateUser.name} onChangeText={(text) => handleUpdateUser('name', text)} style={{width: '100%'}} mode='outlined' label={'Enter Name'}/>
                <TextInput  keyboardType='number-pad' value={updateUser.mobile} onChangeText={(text) => handleUpdateUser('mobile', text)} style={{width: '100%'}} mode='outlined' label={'Enter Mobile'}/>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode='text' onPress={hideDialog}>Cancel</Button>
              <Button mode='contained' onPress={() => handleUpdateUserSubmit()}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Logout Dialog */}
        <Portal>
          <Dialog visible={logOutDialog} onDismiss={() => setLogOutDialog(false)}>

          <Dialog.Title>Logout</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to logout?</Text>
            </Dialog.Content>

            <Dialog.Actions>
              <Button onPress={() => setLogOutDialog(false)}>cancel</Button>
              <Button onPress={() => signOut()}>logout</Button>
            </Dialog.Actions>

          </Dialog>
        </Portal>
        </ScrollView>

        <Loader loader={loader} setLoader={setLoader}/>

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

export default ProfileScreen
