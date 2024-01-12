import { StatusBar } from 'expo-status-bar';
import { MD2LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as NavigationBar from 'expo-navigation-bar';
import AuthNavigator from './src/navigator/AuthNavigator';
import StackNavigator from './src/navigator/StackNavigator';
import { useAuthentication } from './src/utils/useAuthentication';
import { Provider, useDispatch } from 'react-redux';
import store from './src/Store';
import { useEffect, useRef, useState } from 'react';
import { database, fConfig, messaging } from './src/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { setPath } from './src/utils/reducers/DatabaseReducer';
import Splash from './src/components/layouts/Splash';
import { setBackgroundColorAsync, setVisibilityAsync } from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
import { Vibration } from 'react-native';
import { getTokenforNotification } from './src/utils/notification/getToken';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const myTheme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    secondary: '#24A6C6',
    primary: '#003BA0',
    primaryLight: '#DEE1E6',
    primaryDark: '#003BA0',
    background: 'white',
  },
};

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    getTokenforNotification().then(token => {});

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      Vibration.vibrate();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  NavigationBar.setBackgroundColorAsync(myTheme.colors.background);
  NavigationBar.setButtonStyleAsync("dark");


  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}



function Main() {
  const dispatch = useDispatch();
  const [dbPath, setDbPath] = useState(false);
  const { liveUser } = useAuthentication();
  //  set baseUrl
  useState(() => {
    const dbRef = ref(database, 'utils/path');
    onValue(dbRef, (snapshot) => {
      console.log(snapshot.val());
      dispatch(setPath(snapshot.val()));
      setDbPath(true);
    }, (error) => {
      console.log(error);
    })
  }, []);


  if (!dbPath) {
    return <Splash bg={myTheme.colors.primaryDark} />
  }

  setVisibilityAsync('visible');
  setBackgroundColorAsync('white');

  return (
    <PaperProvider theme={myTheme}>
      <StatusBar backgroundColor={myTheme.colors.background} style='dark' />
      {liveUser ? <StackNavigator /> : <AuthNavigator />}
    </PaperProvider>
  )
}






// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });

  // async function sendPushNotification(expoPushToken) {
  //   await fetch('https://fcm.googleapis.com/fcm/send', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `AAAAtMY1yVc:APA91bFcQBRwXwIgi73CoVKkJHsgA4GBrZATwi8Ig2jAKPj0cqh4gt1KLjwPNmx3wu2h3RtfjOyx4BkjA1A0w0N0xUhmI8vPTDOOe2RP_KfEsO3s6XOKKcqV737GdhCTjI_m6Hgl9p6R`,
  //     },
  //     body: JSON.stringify({
  //       to: expoPushToken,
  //       priority: 'normal',
  //       data: {
  //         experienceId: '@yourExpoUsername/yourProjectSlug',
  //         scopeKey: '@yourExpoUsername/yourProjectSlug',
  //         title: "📧 You've got mail",
  //         message: 'Hello world! 🌐',
  //       },
  //     }),
  //   });

  // }

  // sendPushNotification(expoPushToken);

// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants?.expoConfig?.extra?.eas?.projectId })).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
