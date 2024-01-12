import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, useTheme, ActivityIndicator } from 'react-native-paper';

const Loader = ({ loader, setLoader }) => {
    const theme = useTheme();


  return (
  
        <Portal>
          <Dialog dismissable={false} visible={loader}  style={{backgroundColor: 'transparent', elevation: 0 }} onDismiss={() => setLoader(false)}>
            {/* <Dialog.Title>Alert</Dialog.Title> */}
            {/* <Dialog.Content> */}
            <View style={{padding: 10, backgroundColor: 'white', alignSelf: 'center', borderRadius: 20}}>
                <ActivityIndicator size={'large'} animating={true} color={theme.colors.primary}/>
            </View>
            {/* </Dialog.Content> */}
            {/* <Dialog.Actions> */}
              {/* <Button onPress={hideDialog}>Done</Button> */}
            {/* </Dialog.Actions> */}
          </Dialog>
        </Portal>
  );
};

export default Loader;