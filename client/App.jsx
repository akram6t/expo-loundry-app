import { StatusBar } from 'expo-status-bar';
import { MD2LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as NavigationBar from 'expo-navigation-bar';
import AuthNavigator from './src/navigator/AuthNavigator';
import StackNavigator from './src/navigator/StackNavigator';
import { useAuthentication } from './src/utils/useAuthentication';
import { Provider, useDispatch } from 'react-redux';
import store from './src/Store';
import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { database, messaging } from './src/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { setPath } from './src/utils/reducers/DatabaseReducer';
import Splash from './src/components/layouts/Splash';
import { setBackgroundColorAsync, setVisibilityAsync } from 'expo-navigation-bar';

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

    transparent1: '#E6DFF6',
    transparent2: '#FAF3EC',
    transparent3: '#ECFAF0',
    transparent4: '#F6FAEC',
  },
};

export default function App() {

  NavigationBar.setBackgroundColorAsync(myTheme.colors.background);
  NavigationBar.setButtonStyleAsync("dark");

  useEffect(() => {
    getToken(messaging).then(token => {
      console.log(token);
    })
  }, []);


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
      // console.log(snapshot.val());
      // dispatch(setPath(snapshot.val()));
      setDbPath(true);
    }, (error) => {
      console.log(error);
    })
  }, []);


  if(!dbPath){
    return <Splash bg={myTheme.colors.primaryDark}/>
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


