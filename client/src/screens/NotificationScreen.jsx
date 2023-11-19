import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'react-native-paper';

const NotificationScreen = ({navigation}) => {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:  theme.colors.background}}>
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
      {/* Header End */}
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>no notifications</Text>
      </View>
    </SafeAreaView>
  )
}

export default NotificationScreen