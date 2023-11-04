import { StatusBar } from 'expo-status-bar';
import StackNavigator from './StackNavigator';
import { MD2LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as NavigationBar from 'expo-navigation-bar';
import AuthNavigator from './AuthNavigator';
import { useAuthentication } from './src/utils/useAuthentication';
import { Provider } from 'react-redux';
import store from './Store';

const myTheme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    secondary: '#24A6C6',
    primary: '#1DB000',
    primaryLight: '#E5ECE4',
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
  // const { user } = useAuthentication();

  function Main(){
    const { user } = useAuthentication();
    return (
      <PaperProvider theme={myTheme}>
      <StatusBar backgroundColor={myTheme.colors.background} style='dark' />
      { user ? <StackNavigator/> : <AuthNavigator/>}
    </PaperProvider>
    )
  }


  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
}


