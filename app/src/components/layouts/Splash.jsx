import {
  View, Text, Image, NativeModules,
  LayoutAnimation,
  Animated
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { setBackgroundColorAsync, setBehaviorAsync } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { ProgressBar } from 'react-native-paper';



const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);


const Splash = ({ bg }) => {
  useEffect(() => {
    setBackgroundColorAsync(bg);
    setBehaviorAsync('overlay-swipe');
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => fadeOut()); // After fading in, start fading out
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => fadeIn()); // After fading out, start fading in
  };

  useEffect(() => {
    fadeIn(); // Start the animation when the component mounts
  }, []);


  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar backgroundColor={bg} style='inverted' />
      {/* <View style={{zIndex: 50, position: 'absolute', top: 0, left: 0, backgroundColor: 'red', width: size.w, height: size.h }}></View> */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image style={{ width: 150, height: 150 }}
          source={require('./../../../assets/images/background_logo.png')}
        />
      </Animated.View>

      <View style={{ position: 'absolute', bottom: 100, left: 0, width: '100%', opacity: 0.5}}>
        <ProgressBar style={{ width: 100, alignSelf: 'center', backgroundColor: bg}} indeterminate color={'white'}/>
      </View>
    </View>
  )
}

export default Splash;
