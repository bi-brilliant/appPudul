import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

// Custom TabBar
const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: '#383b50'}}
    style={{
      backgroundColor: 'white',
      height: 55,
      elevation: 0,
      borderBottomColor: '#bbb',
      borderBottomWidth: 0.5,
    }}
    renderLabel={({route, focused, color}) => (
      <Text
        style={{
          color: focused ? '#383b50' : '#bbb',
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          maxWidth: 80,
          borderBottomColor: 'yellow',
        }}>
        {route.title}
      </Text>
    )}
  />
);

// Content TabView
const TotalHistory = ({transactionalHistory}) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    style={{paddingHorizontal: 28}}
    overScrollMode="never">
    {transactionalHistory.map((transactionHistory, index) => {
      const {transaction, datetime, time, amount, symbol, extracode, action} =
        transactionHistory;

      return (
        <View style={styles.wrapperItemTable} key={index}>
          <View>
            <Text style={styles.details}>
              {action == 3304
                ? 'Completed'
                : action == 3651
                ? 'Withdrawal details'
                : 'Development test'}
            </Text>
            <Text style={styles.date}>
              {datetime} {time}
            </Text>
          </View>
          <View>
            <Text style={styles.price}>
              {amount} {symbol}
            </Text>
            <Text style={styles.status}>
              {extracode == 9453
                ? '-'
                : extracode == 9001
                ? 'Withdrawal approval'
                : 'Withdrawal not approved'}
            </Text>
          </View>
        </View>
      );
    })}
  </ScrollView>
);

const TransferHistory = () => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    style={{paddingHorizontal: 28}}
    overScrollMode="never">
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Withdrawal details</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>-0.6 XRUN</Text>
        <Text style={styles.status}>Transfer completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Withdrawal details</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>-0.6 XRUN</Text>
        <Text style={styles.status}>Transfer completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Withdrawal details</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>-0.6 XRUN</Text>
        <Text style={styles.status}>Transfer completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Withdrawal details</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>-0.6 XRUN</Text>
        <Text style={styles.status}>Transfer completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Withdrawal details</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>-0.6 XRUN</Text>
        <Text style={styles.status}>Transfer completed</Text>
      </View>
    </View>
  </ScrollView>
);

const ReceivedDetails = () => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    style={{paddingHorizontal: 28}}
    overScrollMode="never">
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Completed</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>0.048 XRUN</Text>
        <Text style={styles.status}>Transfer Completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Completed</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>0.048 XRUN</Text>
        <Text style={styles.status}>Transfer Completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Completed</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>0.048 XRUN</Text>
        <Text style={styles.status}>Transfer Completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Completed</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>0.048 XRUN</Text>
        <Text style={styles.status}>Transfer Completed</Text>
      </View>
    </View>
    <View style={styles.wrapperItemTable}>
      <View>
        <Text style={styles.details}>Completed</Text>
        <Text style={styles.date}>2023-11-22 11:39:04</Text>
      </View>
      <View>
        <Text style={styles.price}>0.048 XRUN</Text>
        <Text style={styles.status}>Transfer Completed</Text>
      </View>
    </View>
  </ScrollView>
);

const TransitionHistory = () => <View style={{flex: 1}} />;

export const TableWalletCard = ({currentCurrency, transactionalHistory}) => {
  const filterTransactionalByCurrency = transactionalHistory.filter(
    transactionalByCurrency =>
      transactionalByCurrency.currency == currentCurrency,
  );

  console.log(filterTransactionalByCurrency);

  const navigation = useNavigation();
  const [currentDaysTransactional, setCurrentDaysTransactional] = useState(7);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'totalHistory', title: 'Total History'},
    {key: 'transferHistory', title: 'Transfer History'},
    {key: 'receivedDetails', title: 'Received details'},
    {key: 'transitionHistory', title: 'Transition History'},
  ]);

  const renderScene = SceneMap({
    totalHistory: () => (
      <TotalHistory transactionalHistory={filterTransactionalByCurrency} />
    ),
    transferHistory: TransferHistory,
    receivedDetails: ReceivedDetails,
    transitionHistory: TransitionHistory,
  });

  const currentDaysBackground = '#fedc00';

  const changeCurrentDaysTransactional = days => {
    setCurrentDaysTransactional(days);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.wrapperTextHead}>
        <TouchableOpacity
          style={styles.contentTextHeadDefault}
          activeOpacity={0.7}>
          <Text style={[styles.textHead, styles.textHeadDefault]}>
            Transactional Information/
          </Text>
        </TouchableOpacity>
        {currentCurrency !== '4' ? (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.contentTextHead}
              onPress={() =>
                navigation.navigate('SendWallet', {
                  currentCurrency,
                })
              }>
              <Text style={styles.textHead}>SEND</Text>
            </TouchableOpacity>

            {currentCurrency === '1' ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.contentTextHead}>
                <Text style={styles.textHead}>CHANGE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.contentTextHead}>
                <Text style={styles.textHead}>EXCHANGE</Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}
      </View>

      <View style={styles.contentTable}>
        <View style={styles.wrapperDate}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => changeCurrentDaysTransactional(7)}
            style={[
              styles.wrapperTextDay,
              currentDaysTransactional === 7 && {
                backgroundColor: currentDaysBackground,
              },
            ]}>
            <Text style={styles.textDay}>7DAYS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => changeCurrentDaysTransactional(14)}
            style={[
              styles.wrapperTextDay,
              currentDaysTransactional === 14 && {
                backgroundColor: currentDaysBackground,
              },
            ]}>
            <Text style={styles.textDay}>14DAYS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => changeCurrentDaysTransactional(30)}
            style={[
              styles.wrapperTextDay,
              currentDaysTransactional === 30 && {
                backgroundColor: currentDaysBackground,
              },
            ]}>
            <Text style={styles.textDay}>30DAYS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wrapperTabView}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
    </View>
  );
};

export default TableWalletCard;
const styles = StyleSheet.create({
  wrapperTextHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 36,
    // marginTop: 20,
  },
  contentTextHead: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: 'black',
  },
  contentTextHeadDefault: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 20,
  },
  contentTable: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 22,
  },
  wrapperDate: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  wrapperTextDay: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 26,
    paddingTop: 6,
    paddingBottom: 2,
  },
  textDay: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: 'black',
  },
  wrapperTabView: {
    flex: 1,
    marginTop: 4,
  },
  wrapperItemTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.55,
    paddingBottom: 10,
    paddingTop: 20,
  },
  details: {
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  date: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#aaa',
  },
  price: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textAlign: 'right',
    marginBottom: 10,
  },
  status: {
    fontSize: 12,
    color: '#999',
  },
});
