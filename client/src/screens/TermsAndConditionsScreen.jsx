import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons'
import { useTheme, Snackbar } from 'react-native-paper'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { api } from '../Constaints'
import Loader from '../components/Loader'

const TermsAndConditionsScreen = ({ navigation }) => {
    const theme = useTheme();
    const [ message, setMessage ] = useState();
    const [ loader, setLoader ] = useState(false); 
    const [ snackbar, setSnackbar ] = useState(false);

    const [tCList, setTCList] = useState([]);

    const server = useSelector(state => state.path.path);

    function getTC() {
        setLoader(true);
        axios.get(`${server.baseUrl}/${api.tc}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    setTCList([...data]);
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => getTC(), []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View
                style={{
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
                <Text style={{ fontSize: 20 }}>Terms And Conditions</Text>
            </View>

            <FlatList data={tCList}
            contentContainerStyle={{ padding: 10, gap: 12 }}
                renderItem={({ item, index }) => {
                    return(
                        <View key={index}>
                            {item.title === '' || !item.title ? null :
                                <Text style={{ color: theme.colors.primary, fontSize: 22, fontWeight: 'bold' }}>{item.title}</Text>
                            }
                                <Text style={{ fontSize: 16 }} key={index}>{item.description}</Text>
                        </View>
                    )
                }} />

            <Loader loader={loader} setLoader={setLoader} />

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

export default TermsAndConditionsScreen