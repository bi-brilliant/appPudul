import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import ButtonBack from '../../components/ButtonBack';
import {useNavigation} from '@react-navigation/native';
import CustomMultipleChecbox from '../../components/CustomCheckbox/CustomMultipleCheckbox';

const SignUpScreen = ({route}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [region, setRegion] = useState('');
  const [gender, setGender] = useState('pria');
  const [age, setAge] = useState('10');
  const [refferalEmail, setRefferalEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const {flag, countryCode, country} = route.params || {};

  // console.log(flag, ' + ', countryCode, ' + ', country);

  const navigation = useNavigation();

  const onSignUp = () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Nama harus diisi');
    } else if (email.trim() === '') {
      Alert.alert('Error', 'Email harus diisi');
    } else if (!isValidEmail(email)) {
      Alert.alert('Error', `Format email tidak valid`);
    } else if (password.trim() === '') {
      Alert.alert('Error', 'Password harus diisi');
    } else if (phoneNumber.trim() === '') {
      Alert.alert('Error', `Nomor Telepon harus diisi`);
    } else if (region.trim() === '') {
      Alert.alert('Error', `Daerah harus diisi`);
    } else {
      console.warn('Cek login');
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

  const onBack = () => {
    navigation.navigate('First');
  };

  const chooseRegion = (flag, countryCode, country) => {
    navigation.navigate('ChooseRegion', {
      flag: flag,
      countryCode: countryCode,
      country: country,
    });
  };

  const genderSelector = getGender => {
    if (getGender == 0) {
      setGender('pria');
    } else {
      setGender('wanita');
    }
  };

  const ageSelector = getAge => {
    if (getAge == 0) {
      setAge('10');
    } else if (getAge == 1) {
      setAge('20');
    } else if (getAge == 2) {
      setAge('30');
    } else if (getAge == 3) {
      setAge('40');
    } else if (getAge == 4) {
      setAge('50+');
    }
  };

  console.log(gender, ' - ', age);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.root]}>
        <ButtonBack onClick={onBack} />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Registrasi</Text>
        </View>

        <CustomInput
          label="Nama"
          placeholder="Nama"
          value={name}
          setValue={setName}
          isPassword={false}
        />
        <CustomInput
          label="Email"
          placeholder="xrun@xrun.run"
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
            }}>
            Email anda tidak valid
          </Text>
        )}

        <CustomInput
          label="Kata sandi"
          placeholder="Masukan kata sandi baru anda"
          value={password}
          setValue={setPassword}
          secureTextEntry
          isPassword={true}
        />

        {/* Disini Pilih negara */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nomor Telepon</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <Pressable
              style={{flexDirection: 'row'}}
              onPress={() => chooseRegion(flag, countryCode, country)}>
              <Image
                resizeMode="contain"
                style={{height: 50, width: 35, marginRight: 10}}
                source={
                  flag == undefined
                    ? {
                        uri: 'https://app.xrun.run/flags/id.png',
                      }
                    : {
                        uri: flag,
                      }
                }
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 18,
                  color: '#a8a8a7',
                  alignSelf: 'center',
                  paddingRight: 10,
                }}
                value={phoneNumber}
                setValue={setPhoneNumber}>
                +{countryCode == undefined ? '62' : countryCode}
              </Text>
            </Pressable>
            <TextInput keyboardType="numeric" style={styles.input} />
          </View>
        </View>

        <CustomInput
          label="Daerah"
          placeholder="Cari berdasarkan wilayah anda"
          value={region}
          setValue={setRegion}
          isPassword={false}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <CustomMultipleChecbox
            texts={['Pria', 'Wanita']}
            count={2}
            singleCheck={true}
            wrapperStyle={styles.horizontalChecbox}
            defaultCheckedIndices={[0]}
            onCheckChange={genderSelector}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Umur</Text>
          <CustomMultipleChecbox
            texts={['10', '20', '30', '40', '50+']}
            count={5}
            singleCheck={true}
            wrapperStyle={styles.horizontalChecbox}
            defaultCheckedIndices={[0]}
            onCheckChange={ageSelector}
          />
        </View>

        <CustomInput
          label="Referral Email"
          placeholder="xrun@xrun.run"
          value={refferalEmail}
          setValue={setRefferalEmail}
          isPassword={false}
        />

        <View
          style={{
            backgroundColor: 'red',
            height: 100,
          }}
        />

        <View style={[styles.bottomSection]}>
          <View style={styles.additionalLogin}>
            <Text style={styles.normalText}>
              Masukan kode referral untuk {'\n'}
              mendapatkan bonus spesial XRUN
            </Text>
          </View>
          <Pressable onPress={onSignUp} style={styles.buttonSignUp}>
            <Image
              source={require('../../../assets/images/icon_next.png')}
              resizeMode="contain"
              style={styles.buttonSignUpImage}
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
    marginBottom: -20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#343a59',
  },
  subTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#343a59',
  },
  bottomSection: {
    padding: 20,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  additionalLogin: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: 100,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#343a59',
  },
  buttonSignUp: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'column-reverse',
    height: 100,
    justifyContent: 'center',
  },
  buttonSignUpImage: {
    height: 80,
    width: 80,
  },
  horizontalChecbox: {
    flexDirection: 'row',
    paddingTop: 5,
    alignSelf: 'flex-start',
  },
  formGroup: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 30,
  },
  input: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#343a59',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default SignUpScreen;
