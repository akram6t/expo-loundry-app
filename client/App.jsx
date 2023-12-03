import { StatusBar } from 'expo-status-bar';
import { MD2LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as NavigationBar from 'expo-navigation-bar';
import AuthNavigator from './src/navigator/AuthNavigator';
import StackNavigator from './src/navigator/StackNavigator';
import { useAuthentication } from './src/utils/useAuthentication';
import { Provider } from 'react-redux';
import store from './src/Store';
import { auth } from './src/firebaseConfig';
import { useEffect, useState } from 'react';

const myTheme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    secondary: '#24A6C6',
    // primary: '#8700B0',
    primary: '#6400B0',
    primaryLight: '#E8E4EC',
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

  function Main(){
    // This code for when open app check user and change navigator
    let [ isUser, setIsUser] = useState(false);
    useEffect(() => {
      const user = auth.currentUser;
      if(user){
        setIsUser(true);
      }
    }, [])


    const { user } = useAuthentication();
    return (
      <PaperProvider theme={myTheme}>
      <StatusBar backgroundColor={myTheme.colors.background} style='dark' />
      { user || isUser ? <StackNavigator/> : <AuthNavigator/>}
    </PaperProvider>
    )
  }


  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
}


