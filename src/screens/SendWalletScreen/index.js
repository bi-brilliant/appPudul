import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
  PermissionsAndroid,
  Linking,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ButtonBack from '../../components/ButtonBack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInputWallet from '../../components/CustomInputWallet';
import CustomDropdownWallet from '../../components/CustomDropdownWallet';
import {URL_API} from '../../../utils';

const langData = require('../../../lang.json');

const SendWalletScreen = ({navigation, route}) => {
  const [lang, setLang] = useState({});
  const [iconNextIsDisabled, setIconNextIsDisabled] = useState(true);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const {dataWallet} = route.params;
  const [selectedExchange, setSelectedExchange] = useState('360001');
  const [isVisibleReadQR, setIsVisibleReadQR] = useState(false);
  const [dataMember, setDataMember] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cointrace, setCointrace] = useState([]);

  // Animated notification in QR
  const [fadeAnim] = useState(new Animated.Value(0));
  const [zIndexAnim, setZIndexAnim] = useState(-1);

  useEffect(() => {
    // Get Language
    const getLanguage = async () => {
      try {
        const currentLanguage = await AsyncStorage.getItem('currentLanguage');

        const selectedLanguage = currentLanguage === 'id' ? 'id' : 'eng';
        const language = langData[selectedLanguage];
        setLang(language);
      } catch (err) {
        console.error(
          'Error retrieving selfCoordinate from AsyncStorage:',
          err,
        );
      }
    };

    getLanguage();

    // Get data member
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const dataMember = JSON.parse(userData);
        setDataMember(dataMember);
      } catch (error) {
        console.error('Failed to get userData from AsyncStorage:', err);
      }
    };

    getUserData();
  }, []);

  // List stock exchange
  useEffect(() => {
    const cointrace = async () => {
      try {
        const response = await fetch(`${URL_API}&act=ap4300-cointrace`);
        const result = await response.json();
        setCointrace(result.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.alert('Error get data cointrace: ', err);
        console.log('Error get data cointrace: ', err);
      }
    };

    cointrace();
  }, []);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          Linking.openSettings();
          console.log('Camera permission not granted');
        }
      } catch (error) {
        console.error('Failed to request camera permission:', error);
      }
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (amount === '') {
      setIconNextIsDisabled(true);
    } else if (amount == 0) {
      setIconNextIsDisabled(true);
    } else if (address === '' || address.length < 40) {
      setIconNextIsDisabled(true);
    } else {
      setIconNextIsDisabled(false);
    }
  }, [amount, address]);

  const onBack = () => {
    navigation.navigate('WalletHome');
  };

  const onSend = () => {
    const balance = parseFloat(dataWallet.Wamount).toString();

    if (amount === '') {
      Alert.alert('Warning', 'Please enter the amount to be sent.');
    } else if (amount == 0) {
      Alert.alert('Warning', 'Please enter an amount greater than zero.');
    } else if (amount > balance) {
      Alert.alert('Warning', 'There is not enough money(or bank balance).');
    } else if (address === '') {
      Alert.alert('Warning', 'Please enter the address to be sent.');
    } else if (address.length < 40) {
      Alert.alert('Warning', 'Address less than 40 letters.');
    } else {
      setIsLoading(true);
      const currency = dataWallet.currency;
      // Get limit transfer
      fetch(
        `${URL_API}&act=ap4300-getLimitTransfer&member=${dataMember.member}&currency=${currency}&amountrq=${amount}`,
        {
          method: 'POST',
        },
      )
        .then(response => response.json())
        .then(result => {
          const {available, amountrq} = result;

          if (available === 'FALSE') {
            setIsLoading(false);
            Alert.alert(
              'Failed',
              'Check the current amount and make sure you have enough money in your wallet including gas (transfer fee)',
            );
          } else {
            console.log(`${parseFloat(result.amount)} vs ${amountrq}`);

            if (currency == 11) {
              setIsLoading(true);

              // Check email
              fetch(`${URL_API}&act=check-02-email&email=${dataMember.email}`, {
                method: 'POST',
              })
                .then(result => result.json())
                .then(response => {
                  const {status} = response;
                  if (status == 'false') {
                    Alert.alert('Failed', 'Sending verification code');
                  } else {
                    setIsLoading(false);
                  }
                })
                .catch(err => {
                  Alert.alert('Failed', 'Check email failed: ', err);
                  console.log('Check email failed: ', err);
                });
            } else {
              fetch(
                // Transfer by stock exchange
                `${URL_API}&act=ap4300-03&member=${dataMember.member}&addrto=${address}&currency=${currency}&amount=${amount}&coinmarket=${selectedExchange}`,
                {
                  method: 'POST',
                },
              )
                .then(result => result.json())
                .then(() => {
                  const token = currency == 1 ? 'xr' : 'et';

                  // Transfer coin
                  fetch(
                    `${URL_API}&act=postTransfer&member=${dataMember.member}&to=${address}&token=${token}&amount=${amount}`,
                    {
                      method: 'POST',
                    },
                  )
                    .then(result => result.json())
                    .then(response => {
                      const {status, hash} = response;
                      console.log(`Status: ${status}, Hash: ${hash}`);

                      if (status == 'success') {
                        setIsLoading(false);
                        setAddress('');
                        setAmount('');
                        setSelectedExchange('36001');
                        navigation.navigate('CompleteSend', {
                          amount,
                          addrto: address,
                          txid: hash,
                          symbol: dataWallet.symbol,
                          balance,
                        });
                      } else {
                        setIsLoading(false);
                        Alert.alert('', 'Blockchain has problem or delay.');
                      }
                    })
                    .catch(err => {
                      Alert.alert('Failed', 'Transfer failed: ', err);
                      console.log('Transfer failed postTransfer: ', err);
                    });
                })
                .catch(err => {
                  Alert.alert('Failed', 'Transfer failed: ', err);
                  console.log('Transfer failed ap4300-03: ', err);
                });
            }
          }
        })
        .catch(err => {
          Alert.alert('Failed', 'Check limit transfer failed: ', err);
          setIsLoading(false);
        });
    }
  };

  const onQRCodeScan = () => {
    setIsVisibleReadQR(true);
  };

  const handleQRCodeRead = ({data}) => {
    // setAddress(data);
    // fadeIn();
    // setZIndexAnim(1);
    // setIsVisibleReadQR(false);
    console.log('Ahay');
  };

  // Animation
  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      fadeOut();
    });
  };

  const fadeOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 6000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setZIndexAnim(-1);
    });
  };

  return (
    <View style={styles.container}>
      {/* Loading */}
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={'#fff'} />
        </View>
      )}

      <View style={{flexDirection: 'row'}}>
        <View style={{position: 'absolute', zIndex: 1}}>
          <ButtonBack onClick={onBack} />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {lang && lang.screen_send && lang.screen_send.title
              ? lang.screen_send.title
              : ''}
          </Text>
        </View>
      </View>

      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.partTop}>
          <Text style={styles.currencyName}>{dataWallet.symbol}</Text>
          <View style={styles.partScanQR}>
            <Text style={styles.balance}>
              Balance: {parseFloat(dataWallet.Wamount)} {dataWallet.symbol}
            </Text>
            <TouchableOpacity
              style={styles.scanQRCode}
              activeOpacity={0.7}
              onPress={onQRCodeScan}>
              <Image
                source={require('../../../assets/images/scanqr.png')}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.partBottom}>
          <CustomInputWallet
            value={amount}
            setValue={setAmount}
            isNumber
            label={
              lang && lang.screen_send && lang.screen_send.label_amount
                ? lang.screen_send.label_amount
                : ''
            }
            placeholder={
              lang && lang.screen_send && lang.screen_send.amount_placeholder
                ? lang.screen_send.amount_placeholder
                : ''
            }
          />

          <CustomInputWallet
            value={address}
            setValue={setAddress}
            label={
              lang && lang.screen_send && lang.screen_send.label_address
                ? lang.screen_send.label_address
                : ''
            }
            placeholder={
              lang && lang.screen_send && lang.screen_send.address_placeholder
                ? lang.screen_send.address_placeholder
                : ''
            }
          />

          <CustomDropdownWallet
            label={
              lang && lang.screen_send && lang.screen_send.label_exchange
                ? lang.screen_send.label_exchange
                : ''
            }
            onSelectedExchange={value => {
              setSelectedExchange(value);
            }}
            selectedExchange={selectedExchange}
            cointrace={cointrace}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableOpacity
          onPress={onSend}
          style={styles.button}
          activeOpacity={0.6}>
          <Image
            source={
              iconNextIsDisabled
                ? require('../../../assets/images/icon_nextDisable.png')
                : require('../../../assets/images/icon_next.png')
            }
            resizeMode="contain"
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Scan QR code */}
      {isVisibleReadQR && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            backgroundColor: '#fff',
          }}
          showMarker={true}
          cameraStyle={{height: '100%'}}
          onRead={handleQRCodeRead}
          bottomContent={
            <View style={styles.wrapperTextScanQR}>
              <Text style={styles.textScanQR}>Scan Account</Text>
            </View>
          }
        />
      )}

      <Animated.View
        style={{
          alignItems: 'center',
          position: 'absolute',
          bottom: 40,
          right: 0,
          left: 0,
          zIndex: zIndexAnim,
          opacity: fadeAnim,
        }}>
        <View
          style={{
            backgroundColor: 'rgb(65, 65, 65)',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            maxWidth: 300,
          }}>
          <Image
            source={require('../../../assets/images/xrun_round.png')}
            style={{width: 28, height: 28}}
          />
          <Text style={styles.notificationTextInQR}>Scanned: {address}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default SendWalletScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  titleWrapper: {
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
    elevation: 5,
    zIndex: 0,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#051C60',
    margin: 10,
  },
  partTop: {
    backgroundColor: '#343c5a',
    paddingHorizontal: 28,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyName: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  balance: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  partBottom: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 80,
  },
  button: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 24,
    marginTop: 30,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  buttonImage: {
    height: 95,
    width: 95,
  },
  partScanQR: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  scanQRCode: {
    backgroundColor: '#fff',
    width: 30,
  },
  wrapperTextScanQR: {
    position: 'absolute',
    bottom: 40,
  },
  textScanQR: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  notificationTextInQR: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    margin: 0,
    maxWidth: 240,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
