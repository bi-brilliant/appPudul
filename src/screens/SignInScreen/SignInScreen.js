import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomInput from '../../components/CustomInput/';
import ButtonBack from '../../components/ButtonBack/';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {URL_API, getLanguage2} from '../../../utils';
import crashlytics from '@react-native-firebase/crashlytics';

const SignInScreen = () => {
  const [lang, setLang] = useState({});
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigation = useNavigation();

  let ScreenHeight = Dimensions.get('window').height;

  const onSignIn = async () => {
    if (email.trim() === '') {
      Alert.alert(
        'Error',
        lang.screen_signin.alert ? lang.screen_signin.alert.emptyEmail : '',
      );
    } else if (!isValidEmail(email)) {
      Alert.alert(
        'Error',
        lang.screen_signin.alert ? lang.screen_signin.alert.invalidEmail : '',
      );
    } else if (password.trim() === '') {
      Alert.alert(
        'Error',
        lang.screen_signin.alert ? lang.screen_signin.alert.emptyPassword : '',
      );
    } else {
      try {
        const response = await fetch(
          `${URL_API}&act=login-01&tp=4&email=${email}&pin=${password}`,
        );
        const data = await response.json();

        if (data.data === 'false') {
          Alert.alert(
            lang ? lang.screen_signin.alert.fail : '',
            lang ? lang.screen_signin.failedLogin : '',
          );

          setEmail('');
          setPassword('');
        } else {
          await AsyncStorage.setItem('userEmail', email);
          await AsyncStorage.setItem('userData', JSON.stringify(data));
          login();

          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          lang ? lang.screen_signin.alert.error : '',
          lang ? lang.screen_signin.errorLogin : '',
        );
        setEmail('');
        setPassword('');
        crashlytics().recordError(new Error(error));
        crashlytics().log(error);
      }
    }
  };

  const isValidEmail = email => {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  onEmailChange = text => {
    setEmail(text);
    setIsEmailValid(isValidEmail(text));
  };

  const onEmailAuth = () => {
    navigation.navigate('EmailAuth', {screenBack: 'SignIn'});
  };

  const onBack = () => {
    navigation.navigate('First');
  };

  useEffect(() => {
    // Get Language Data
    const fetchData = async () => {
      try {
        const currentLanguage = await AsyncStorage.getItem('currentLanguage');
        const screenLang = await getLanguage2(currentLanguage);

        // Set your language state
        setLang(screenLang);
      } catch (err) {
        console.error('Error in fetchData:', err);
        crashlytics().recordError(new Error(err));
        crashlytics().log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
      <View style={[styles.root, {height: ScreenHeight}]}>
        <ButtonBack onClick={onBack} />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {lang && lang.screen_signin && lang.screen_signin.title
              ? lang.screen_signin.title
              : ''}
          </Text>
          <Text style={styles.subTitle}>
            {lang && lang.screen_signin && lang.screen_signin.subTitle
              ? lang.screen_signin.subTitle
              : ''}
          </Text>
        </View>

        <CustomInput
          label={
            lang && lang.screen_signin && lang.screen_signin.email
              ? lang.screen_signin.email.label
              : ''
          }
          placeholder={
            lang && lang.screen_signin && lang.screen_signin.email
              ? lang.screen_signin.email.placeholder
              : ''
          }
          value={email}
          setValue={onEmailChange}
          isPassword={false}
        />
        {isEmailValid ? null : (
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 25,
              color: 'red',
              fontFamily: 'Roboto-Regular',
              fontSize: 13,
            }}>
            {lang && lang.screen_signin && lang.screen_signin.validator
              ? lang.screen_signin.validator
              : ''}
          </Text>
        )}

        <CustomInput
          label={
            lang && lang.screen_signin && lang.screen_signin.password
              ? lang.screen_signin.password.label
              : ''
          }
          placeholder={
            lang && lang.screen_signin && lang.screen_signin.password
              ? lang.screen_signin.password.placeholder
              : ''
          }
          value={password}
          setValue={setPassword}
          secureTextEntry
          isPassword={true}
        />

        <View style={[styles.bottomSection]}>
          <View style={styles.additionalLogin}>
            <Text style={styles.normalText}>
              {lang && lang.screen_signin && lang.screen_signin.authcode
                ? lang.screen_signin.authcode.label + ' '
                : ''}
            </Text>
            <Pressable onPress={onEmailAuth} style={styles.resetPassword}>
              <Text style={styles.emailAuth}>
                {lang && lang.screen_signin && lang.screen_signin.authcode
                  ? lang.screen_signin.authcode.link
                  : ''}
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={onSignIn} style={styles.buttonSignIn}>
            <Image
              source={require('../../../assets/images/icon_next.png')}
              resizeMode="contain"
              style={styles.buttonSignInImage}
            />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
  },
  titleWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: '#343a59',
  },
  subTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#343a59',
    marginTop: -5,
  },
  bottomSection: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  additionalLogin: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: 100,
  },
  normalText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: '#343a59',
  },
  emailAuth: {
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    color: '#343a59',
  },
  buttonSignIn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'column-reverse',
    height: 100,
    justifyContent: 'center',
  },
  buttonSignInImage: {
    height: 80,
    width: 80,
  },
});

export default SignInScreen;
