import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Divider, MD2Colors, useTheme, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { TabScreen, Tabs, TabsProvider, useTabIndex, useTabNavigation } from "react-native-paper-tabs";
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { routes, api } from "../Constaints";
import Loader from "../components/Loader";
import axios from "axios";
import { useSelector } from "react-redux";

const PickupDropScreen = ({ navigation }) => {
    const theme = useTheme();
    const [timingData, setTimingData] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [pickupDateTime, setPickupDateTime] = useState(null);
    // const [dropDateTime, setDropDateTime] = useState(null);
    const [loader, setLoader] = useState(false);

    const [snackBar, setSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    const server = useSelector(state => state.path.path);


    const getTimingData = () => {
        setLoader(true);
        // const uid = auth.currentUser.uid;
        axios.get(`${server.baseUrl}/${api.ordertiming}`, { headers: { "Content-Type": 'application/json', apikey: server.apikey } })
            .then((result, err) => {
                setLoader(false);
                const { status, data } = result.data;
                if (status) {
                    setTimingData([...data]);
                }
            }).catch(err => {
                setLoader(false);
                setMessage(`${err}`);
                setSnackbar(true);
                console.log(err);
            })
    }

    useEffect(() => {
        getTimingData();
    }, []);


    const handleOnSubmit = (drop_date_time) => {
        // setDropDateTime(dropDateTime);
        if (pickupDateTime !== null) {
            navigation.navigate(routes.AddressScreen,
                {
                    dateTime: {
                        pickupDateTime: pickupDateTime, dropDateTime: drop_date_time
                    }
                }
            );
        } else {
            setMessage('please select pickup time');
            setSnackbar(true);
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
                <Text style={{ fontSize: 20 }}>Select Date & Time</Text>
            </View>
            {/* Appbat End */}
            <TabsProvider defaultIndex={tabIndex} onChangeIndex={(index) => setTabIndex(index)}>
                <Tabs disableSwipe style={{ backgroundColor: theme.colors.background }}>
                    <TabScreen label="Pickup Date">
                        <PickupDate setPickupData={(item) => setPickupDateTime({ ...item })} setMessage={setMessage} setSnackbar={setSnackbar} timingData={timingData} />
                    </TabScreen>
                    <TabScreen label="Drop Date">
                        <DropDate setDropData={(item) => handleOnSubmit({ ...item })} setMessage={setMessage} setSnackbar={setSnackbar} timingData={timingData} />
                    </TabScreen>
                </Tabs>
            </TabsProvider>

            <Loader loader={loader} setLoader={setLoader} />

            <Snackbar
                style={{ position: 'fixed', bottom: 0, left: 0 }}
                visible={snackBar}
                onDismiss={() => setSnackbar(false)}
                action={{

                    label: 'X',
                    onPress: () => {
                        setSnackbar(false)
                    },
                }}>
                {message}
            </Snackbar>

        </SafeAreaView>
    );
};


const PickupDate = ({ setPickupData, setMessage, setSnackbar, timingData }) => {
    const theme = useTheme();
    const [selectedTime, setSelectedTime] = useState(-1);

    const tabNavigation = useTabNavigation();

    const today = new Date(); // Get today's date
    const [selectedDate, setSelectedDate] = useState(today);
    const endDate = new Date(today); // Create a copy of today's date
    endDate.setDate(today.getDate() + 7);
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginStart: 15, marginBottom: 10, marginTop: 20, fontSize: 14, color: theme.colors.primary }}>SELECT PICKUP DATE</Text>
            <View>
                <HorizontalDatepicker
                    mode="gregorian"
                    startDate={today}
                    endDate={endDate}
                    initialSelectedDate={today}
                    onSelectedDateChange={(date) => setSelectedDate(date)}
                    selectedItemWidth={170}
                    unselectedItemWidth={50}
                    itemHeight={40}
                    itemRadius={40}
                    //   selectedItemTextStyle={styles.selectedItemTextStyle}
                    //   unselectedItemTextStyle={styles.selectedItemTextStyle}
                    selectedItemBackgroundColor={theme.colors.primary}
                    unselectedItemBackgroundColor="#ececec"
                    flatListContainerStyle={{ height: 50, backgroundColor: theme.colors.background }}
                //   flatListContainerStyle={styles.flatListContainerStyle}
                />
            </View>

            <Divider />

            <Text style={{ marginStart: 15, marginBottom: 10, marginTop: 20, fontSize: 14, color: theme.colors.primary }}>SELECT PICKUP TIME</Text>
            <FlatList
                data={timingData}
                numColumns={2}
                contentContainerStyle={{ padding: 5 }}
                renderItem={({ item, index }) => (
                    <Button mode={index === selectedTime ? 'contained' : 'outlined'} style={{ flex: 1, margin: 8, borderRadius: 50 }} labelStyle={{ fontSize: 14 }}
                        onPress={() => {
                            setSelectedTime(index)
                        }} key={index}> <Text numberOfLines={2}>{item.time}</Text></Button>
                )}
                keyExtractor={(item, index) => index.toString()} />
            <Button mode="contained" style={{ margin: 8 }} contentStyle={{ padding: 5 }}
                onPress={() => {
                    if (selectedTime !== -1) {
                        // getPickupData();
                        tabNavigation(1)
                        setPickupData({ date: selectedDate, time: timingData[selectedTime].time })
                        // console.log(selectedDate);
                    } else {
                        setMessage('please select pickup time');
                        setSnackbar(true);
                    }

                    // }
                }}>Next</Button>
        </View>
    )
}



const DropDate = ({ setDropData, setMessage, setSnackbar, timingData }) => {
    const theme = useTheme();
    const [selectedTime, setSelectedTime] = useState(-1);

    const tabNavigation = useTabNavigation();

    const today = new Date(); // Get today's date
    const [selectedDate, setSelectedDate] = useState(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    const endDate = new Date(today); // Create a copy of today's date
    endDate.setDate(today.getDate() + 7);
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginStart: 15, marginBottom: 10, marginTop: 20, fontSize: 14, color: theme.colors.primary }}>SELECT DROP DATE</Text>
            <View>
                <HorizontalDatepicker
                    mode="gregorian"
                    startDate={startDate}
                    endDate={endDate}
                    initialSelectedDate={startDate}
                    onSelectedDateChange={(date) => setSelectedDate(date)}
                    selectedItemWidth={170}
                    unselectedItemWidth={50}
                    itemHeight={40}
                    itemRadius={40}
                    //   selectedItemTextStyle={styles.selectedItemTextStyle}
                    //   unselectedItemTextStyle={styles.selectedItemTextStyle}
                    selectedItemBackgroundColor={theme.colors.primary}
                    unselectedItemBackgroundColor="#ececec"
                    flatListContainerStyle={{ height: 50, backgroundColor: theme.colors.background }}
                //   flatListContainerStyle={styles.flatListContainerStyle}
                />
            </View>

            <Text style={{ marginStart: 15, marginBottom: 10, marginTop: 20, fontSize: 14, color: theme.colors.primary }}>SELECT DROP TIME</Text>
            <FlatList
                data={timingData}
                numColumns={2}
                contentContainerStyle={{ padding: 5 }}
                renderItem={({ item, index }) => (
                    <Button mode={index === selectedTime ? 'contained' : 'outlined'} style={{ flex: 1, margin: 8, borderRadius: 50 }} labelStyle={{ fontSize: 14 }}
                        onPress={() => setSelectedTime(index)} key={index}><Text numberOfLines={2}>{item.time}</Text></Button>
                )}
                keyExtractor={(item, index) => index.toString()} />


            <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onPress={() => tabNavigation(0)} mode="outlined">Back</Button>
                <Button mode="contained" style={{ margin: 8 }} contentStyle={{ padding: 5 }}
                    onPress={() => {
                        if (selectedTime !== -1) {
                            setDropData({ date: selectedDate, time: timingData[selectedTime].time });
                        } else {
                            setMessage('please select drop time');
                            setSnackbar(true);
                        }
                    }}>Continue</Button>
            </View>
        </View>
    )
}

export default PickupDropScreen;
