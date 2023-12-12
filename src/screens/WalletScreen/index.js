import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonBack from '../../components/ButtonBack';
import Clipboard from '@react-native-clipboard/clipboard';
import {TabView, SceneMap} from 'react-native-tab-view';
import TableWalletCard from '../../components/TableWallet';

const langData = require('../../../lang.json');

const routeComponent = (cardData, showTextQRCode, refXRUNCard, copiedHash) => {
  return (
    <View style={styles.card(cardData.key)} key={cardData.key}>
      <View style={styles.wrapperPartTop}>
        <Text style={styles.cardName}>{cardData.title}</Text>
        <View style={styles.wrapperShowQR}>
          <TouchableOpacity
            style={styles.wrapperDots}
            activeOpacity={0.6}
            onPress={showTextQRCode}
            ref={refXRUNCard}>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerTextWallet}>
        <View style={styles.wrapperTextwallet}>
          <Text style={styles.textWallet}>Possess</Text>
          <Text style={styles.valueWallet}>{cardData.possess}</Text>
          <Text style={styles.textWallet}>{cardData.possessText}</Text>
        </View>

        <View style={styles.wrapperTextwallet}>
          <Text style={styles.textWallet}>Catch</Text>
          <Text style={styles.valueWallet}>{cardData.catch}</Text>
          <Text style={styles.textWallet}>{cardData.catchText}</Text>
        </View>
      </View>

      <View style={styles.wrapperPartBottom}>
        <View style={styles.wrapperCopiedHash}>
          <View style={styles.wrapperHash}>
            <Text style={styles.hash}>
              {cardData.hash.substring(0, 10) +
                '...' +
                cardData.hash.substring(cardData.hash.length - 10)}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => copiedHash(cardData.hash)}>
            <Image source={require('../../../assets/images/clipboard.png')} />
          </TouchableOpacity>
        </View>

        <Image source={cardData.logo} style={styles.logo} />
      </View>
    </View>
  );
};

const WalletScreen = ({navigation}) => {
  const [lang, setLang] = useState({});
  const [isShowTextQRCode, setIsShowTextQRCode] = useState(false);
  const [xrunHash, setXrunHash] = useState('0xd54D62C609kasdj05d35324f');
  const [ethHash, setEthHash] = useState('0xd54D62C60945ffj05d353255');
  const [digxHash, setDigxHash] = useState('0xd54D62C504kasdj05d3522ac');
  const refXRUNCard = useRef(null);
  const [positionVerticalDots, setPositionVerticalDots] = useState(0);
  const layout = useWindowDimensions();
  const [currentToken, setCurrentToken] = useState('xrun');
  const [index, setIndex] = useState(0);
  const cardsData = [
    {
      key: 'xrun',
      title: 'XRUN',
      possess: 1.87,
      possessText: 'XRUN',
      catch: 44.71,
      catchText: 'XRUN',
      hash: xrunHash,
      logo: require('../../../assets/images/logo_xrun.png'),
    },
    {
      key: 'eth',
      title: 'Ethereum',
      possess: '0.00',
      possessText: 'ETH',
      catch: '0.00',
      catchText: 'XRUN',
      hash: ethHash,
      logo: require('../../../assets/images/eth-icon.png'),
    },
    {
      key: 'digx',
      title: 'DIGX for AirDrop',
      possess: '0.00',
      possessText: 'DIGX',
      catch: '0.00',
      catchText: 'XRUN',
      hash: digxHash,
      logo: require('../../../assets/images/logo_xrun.png'),
    },
  ];

  const renderScene = SceneMap(
    Object.fromEntries(
      cardsData.map(card => [
        card.key,
        () => routeComponent(card, showTextQRCode, refXRUNCard, copiedHash),
      ]),
    ),
  );

  const [routes] = useState(
    cardsData.map(card => ({key: card.key, title: card.title})),
  );

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

    // Mengukur posisi dan ukuran View setelah rendering
    if (refXRUNCard.current) {
      refXRUNCard.current.measure((x, y, width, height, pageX, pageY) => {
        setPositionVerticalDots(pageY);
      });
    }
  }, []);

  const handleKeyCard = index => {
    console.log(index);

    switch (index) {
      case 0:
        setCurrentToken('xrun');
        break;
      case 1:
        setCurrentToken('eth');
        break;
      case 2:
        setCurrentToken('digx');
        break;
      default:
        setCurrentToken('xrun');
        break;
    }
  };

  const showTextQRCode = () => {
    setIsShowTextQRCode(true);
  };

  const hideTextQRCode = () => {
    setIsShowTextQRCode(false);
  };

  const copiedHash = hash => {
    Clipboard.setString(hash);

    Alert.alert(
      '',
      'The wallet address has been copied. Use it wherever you want.',
      [
        {
          text: 'OK',
        },
      ],
    );
  };

  const onBack = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <View style={{position: 'absolute', zIndex: 1}}>
          <ButtonBack onClick={onBack} />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {lang && lang.screen_wallet && lang.screen_wallet.title
              ? lang.screen_wallet.title
              : ''}
          </Text>
        </View>
      </View>

      <View style={styles.containerCard}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={index => {
            setIndex(index);
            handleKeyCard(index);
          }}
          initialLayout={{width: layout.width}}
          renderTabBar={() => null}
          lazy
          overScrollMode={'never'}
        />
      </View>

      <View style={styles.containerTable}>
        <TableWalletCard currentToken={currentToken} />
      </View>

      {isShowTextQRCode && (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.showQRButton(positionVerticalDots)}>
            <Text style={styles.textQRCode}>QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={hideTextQRCode}
            style={styles.backgroundShowQR}></TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default WalletScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  containerCard: {
    flex: 0.93,
  },
  containerTable: {
    flex: 1,
    flexGrow: 2,
  },

  titleWrapper: {
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: 'white',
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
  card: token => ({
    backgroundColor:
      token === 'xrun' ? '#177f9a' : token === 'eth' ? '#a74248' : '#343b58',
    marginHorizontal: 36,
    marginTop: 20,
    padding: 20,
    paddingTop: 0,
    borderRadius: 8,
    height: 200,
    zIndex: 5,
    width: Dimensions.get('window').width - 72,
  }),
  wrapperPartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardName: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    paddingTop: 20,
  },
  wrapperShowQR: {
    position: 'relative',
  },
  wrapperDots: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  showQRButton: positionY => ({
    position: 'absolute',
    backgroundColor: 'white',
    width: 200,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    zIndex: 2,
    top: positionY + 50,
    right: 56,
  }),
  backgroundShowQR: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'red',
  },
  textQRCode: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 20,
  },
  containerTextWallet: {
    marginTop: 28,
  },
  wrapperTextwallet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textWallet: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  valueWallet: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
  },
  wrapperPartBottom: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperCopiedHash: {
    flexDirection: 'row',
    gap: 6,
  },
  wrapperHash: {
    flexDirection: 'row',
  },
  hash: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  logo: {
    height: 48,
    width: 48,
    marginTop: -28,
  },
});
