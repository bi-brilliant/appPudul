import {Alert} from 'react-native';

// Endpoint API
const authcode = 'fqyXqh2E47G04fm10NBDChQqURBYD965';
export const URL_API = `https://app.xrun.run/gateway.php?authcode=${authcode}`;

const funcTransaction = async (
  nameTransaction,
  act,
  member,
  currency,
  daysbefore,
) => {
  try {
    const request = await fetch(
      `${URL_API}&act=${act}&startwith=0&member=${member}&currency=${currency}&daysbefore=${daysbefore}`,
    );
    const response = await request.json();
    return response.data;
  } catch (err) {
    console.log(`Failed get ${nameTransaction}: ${err}`);
    Alert.alert('', `Failed get ${nameTransaction}: ${err}`);
  }
};

export const funcTotalHistory = async (
  nameTransaction = 'totalHistory',
  act = 'app4200-05',
  member,
  currency,
  daysbefore,
) => {
  return await funcTransaction(
    nameTransaction,
    act,
    member,
    currency,
    daysbefore,
  );
};

export const funcTransferHistory = async (
  nameTransaction = 'transferHistory',
  act = 'app4200-06',
  member,
  currency,
  daysbefore,
) => {
  return await funcTransaction(
    nameTransaction,
    act,
    member,
    currency,
    daysbefore,
  );
};

export const funcReceivedDetails = async (
  nameTransaction = 'receivedDetails',
  act = 'app4200-01',
  member,
  currency,
  daysbefore,
) => {
  return await funcTransaction(
    nameTransaction,
    act,
    member,
    currency,
    daysbefore,
  );
};

export const funcTransitionHistory = async (
  nameTransaction = 'transitionHistory',
  act = 'app4200-03',
  member,
  currency,
  daysbefore,
) => {
  return await funcTransaction(
    nameTransaction,
    act,
    member,
    currency,
    daysbefore,
  );
};

// Get Language
export const getLanguage = async (lang, screenName) => {
  try {
    let langData;

    switch (lang) {
      case 'id':
        langData = require('./languages/id.json');
        break;
      case 'en':
        langData = require('./languages/en.json');
        break;
      case 'ko':
        langData = require('./languages/ko.json');
        break;
      case 'zh':
        langData = require('./languages/zh.json');
        break;
      default:
        langData = require('./languages/en.json');
        break;
    }

    const screenLangData = langData ? langData[screenName] : null;
    return screenLangData;
  } catch (err) {
    console.error('Error retrieving Get Language from AsyncStorage: ', err);
    return null;
  }
};
