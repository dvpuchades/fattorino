import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log('Error storing data:', e);
  }
}

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      return value;
    }
  } catch(e) {
    console.log('Error getting data:', e);
    return undefined;
  }
}

export { storeData, getData };