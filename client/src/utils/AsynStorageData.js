import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing data
export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
    // console.log('Data stored successfully!');
  } catch (error) {
      console.error('Error storing data:', error);
      return false;
  }
};

// Retrieving data
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
        return JSON.parse(value);
    //   console.log('Retrieved data:', value);
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return false;
  }
};

// Removing data
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
    // console.log('Data removed successfully!');
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Clearing all data
// const clearAllData = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log('All data cleared successfully!');
//   } catch (error) {
//     console.error('Error clearing data:', error);
//   }
// };
