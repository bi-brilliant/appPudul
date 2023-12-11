import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import ButtonBack from '../../components/ButtonBack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

const langData = require('../../../lang.json');

const AdvertiseScreen = () => {
  const [lang, setLang] = useState({});
  const navigation = useNavigation();
  let ScreenHeight = Dimensions.get('window').height;
  const [completedAds, setCompletedAds] = useState([]);
  const [userData, setUserData] = useState({});
  const [chatText, setChatText] = useState('');
  const [completedAdsLoading, setCompletedAdsLoading] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'An Advertisement in Storage'},
    {key: 'second', title: 'Mission Completed Advertisement'},
  ]);
  const scrollViewRef = useRef();
  const layout = useWindowDimensions();

  // Back
  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Get Language
    const getLanguage = async () => {
      try {
        const currentLanguage = await AsyncStorage.getItem('currentLanguage');
        const selectedLanguage = currentLanguage === 'id' ? 'id' : 'eng';
        const language = langData[selectedLanguage];
        setLang(language);

        // Get User Data
        const userData = await AsyncStorage.getItem('userData');
        const getData = JSON.parse(userData);

        setUserData(getData);

        const response = await fetch(
          `https://app.xrun.run/gateway.php?act=app5010-02&member=${getData.member}`,
        );
        const data = await response.json();

        if (data && data.data.length > 0) {
          const filteredAds = data.data.map(ad => ({
            transaction: ad.transaction,
            title: ad.title,
            coin: ad.amount + ' ' + ad.symbol,
            extracode: ad.extracode,
            datetime: ad.datetime,
            statusSuccess: 'Coin acquisition completed',
            statusPending: 'Waiting for Coin Acquisition',
          }));

          setCompletedAds(filteredAds);
        }

        setCompletedAdsLoading(false);
      } catch (err) {
        console.error(
          'Error retrieving selfCoordinate from AsyncStorage:',
          err,
        );
      }
    };

    getLanguage();
  }, []);

  const storageRoute = () => (
    <View style={{flex: 1, backgroundColor: '#673ab7'}} />
  );

  const completedRoute = () => (
    <View
      style={{
        flex: 1,
      }}>
      {completedAdsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#343a59" />
          <Text style={styles.normalText}>Loading data, please wait...</Text>
        </View>
      ) : (
        <ScrollView style={{marginTop: 5}}>
          {completedAds.map((ad, index) => (
            <View style={styles.list} key={ad.transaction}>
              <View style={styles.listUpWrapper}>
                <Text
                  style={[styles.mediumText, {width: 160}]}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {ad.title}
                </Text>
                <Text style={styles.smallText}>{ad.statusPending}</Text>
              </View>
              <View style={[styles.listUpWrapper, {marginTop: -6}]}>
                <Text style={styles.smallText}>{ad.datetime}</Text>
                <Text style={styles.mediumText}>{ad.coin}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderScene = SceneMap({
    first: storageRoute,
    second: completedRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#051C60', height: 3}}
      style={{backgroundColor: 'white'}}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            color: focused ? 'black' : 'grey',
            fontFamily: focused ? 'Poppins-Medium' : 'Poppins-Regular',
            fontSize: 13,
            textAlign: 'center',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  // Putus Disnini

  // Delete Chat
  const deleteChat = async data => {
    try {
      const response = await fetch(
        `https://app.xrun.run/gateway.php?act=ap6000-03&member=${userData.member}&board=${data.board}`,
      );
      const jsonData = await response.json();

      if (jsonData.data[0].count == 1) {
        // Remove clicked Chat
        setCompletedAds(prevNotify =>
          prevNotify.filter(item => item.board !== data.board),
        );
      }
    } catch (error) {
      console.error('Error sending chat:', error);
    }
  };

  // Delete All Chat
  const deleteAllChat = async () => {
    try {
      // Show a confirmation alert
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete all chats?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              setIsDelete(false);

              const response = await fetch(
                `https://app.xrun.run/gateway.php?act=ap6000-04delete&member=${userData.member}`,
              );
              const jsonData = await response.json();

              if (jsonData.data[0].count > 0) {
                // Remove All Inquiry Chat
                setCompletedAds(prevNotify =>
                  prevNotify.filter(item => item.type !== 9303),
                );
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error sending chat:', error);
    }
  };

  return (
    <View style={[styles.root, {height: ScreenHeight}]}>
      {/* Title */}
      <View style={{flexDirection: 'row', zIndex: 1}}>
        <View style={{position: 'absolute', zIndex: 1}}>
          {isDelete ? (
            <TouchableOpacity
              onPress={() => setIsDelete(false)}
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 20,
                paddingLeft: 25,
                paddingRight: 30,
                marginTop: 5,
              }}>
              <Image
                source={require('../../../assets/images/icon_close_2.png')}
                resizeMode="contain"
                style={{
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          ) : (
            <ButtonBack onClick={handleBack} />
          )}
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Advertising Storage</Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              padding: 15,
            }}
            onPress={() => {
              if (isDelete) {
                return deleteAllChat();
              } else {
                return setIsDelete(true);
              }
            }}>
            <Text
              style={{
                color: '#ffdc04',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 13,
              }}>
              {isDelete ? 'DELETE ALL' : 'DELETE'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
  },
  titleWrapper: {
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    flex: 1,
    elevation: 2,
    zIndex: 0,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#051C60',
    margin: 10,
  },
  normalText: {
    color: 'grey',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  smallText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: 'grey',
    paddingTop: 7,
  },
  mediumText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: 'black',
  },
  list: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 2,
  },
  listUpWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  // tabBar: {
  //   flexDirection: 'row',
  //   backgroundColor: '#051C60', // Ganti dengan warna latar belakang yang diinginkan
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // tabItem: {
  //   flex: 1,
  //   alignItems: 'center',
  // },
  // tabText: {
  //   fontFamily: 'Poppins-Regular',
  //   fontSize: 13,
  //   color: 'black', // Ganti dengan warna teks yang diinginkan
  // },
});

export default AdvertiseScreen;