// Endpoint API
const authcode = 'fqyXqh2E47G04fm10NBDChQqURBYD965';
export const URL_API = `https://app.xrun.run/gateway.php?authcode=${authcode}`;

// * Funtion TransactionalInformation
export const funcTransactionalInformation = async (
  member,
  currencies,
  setTransactionalInformation,
  Alert,
) => {
  totalHistory(member, currencies, setTransactionalInformation, Alert);
  transferHistory(member, currencies, setTransactionalInformation, Alert);
  receivedDetails(member, currencies, setTransactionalInformation, Alert);
  transitionHistory(member, currencies, setTransactionalInformation, Alert);
};

// ? Function Total History
const totalHistory = async (
  member,
  currencies,
  setTransactionalInformation,
  Alert,
) => {
  const fetchData = async () => {
    try {
      const requests = currencies.map(currency =>
        fetch(
          `${URL_API}&act=app4200-05&startwith=0&member=${member}&currency=${currency}&daysbefore=30`,
          {
            method: 'POST',
          },
        ),
      );

      const responses = await Promise.all(requests);
      const results = await Promise.all(
        responses.map(response => response.json()),
      );

      const newData = results.reduce(
        (acc, result) => [...acc, ...result.data],
        [],
      );
      console.log('API Total History');
      setTransactionalInformation(prevData => ({
        ...prevData,
        totalHistory: newData,
      }));
    } catch (error) {
      Alert.alert(
        'Failed',
        "Sorry can't get data Transactional Information, try again later",
        [
          {
            text: 'OK',
            onPress: () => console.log('Failed get data Total History'),
          },
        ],
      );
      setIsLoading(false);
    }
  };

  fetchData();
};

// ? Function Transfer History
const transferHistory = async (
  member,
  currencies,
  setTransactionalInformation,
  Alert,
) => {
  const fetchData = async () => {
    try {
      const requests = currencies.map(currency =>
        fetch(
          `${URL_API}&act=app4200-06&startwith=0&member=${member}&currency=${currency}&daysbefore=30`,
          {
            method: 'POST',
          },
        ),
      );

      const responses = await Promise.all(requests);
      const results = await Promise.all(
        responses.map(response => response.json()),
      );
      console.log('API Transfer History');

      const newData = results.reduce(
        (acc, result) => [...acc, ...result.data],
        [],
      );

      setTransactionalInformation(prevData => ({
        ...prevData,
        transferHistory: newData,
      }));
    } catch (error) {
      Alert.alert(
        'Failed',
        "Sorry can't get data Transactional Information, try again later",
        [
          {
            text: 'OK',
            onPress: () => console.log('Failed get data Total History'),
          },
        ],
      );
      setIsLoading(false);
    }
  };

  fetchData();
};

// ? Function Received details
const receivedDetails = async (
  member,
  currencies,
  setTransactionalInformation,
  Alert,
) => {
  const fetchData = async () => {
    try {
      const requests = currencies.map(currency =>
        fetch(
          `${URL_API}&act=app4200-01&startwith=0&member=${member}&currency=${currency}&daysbefore=30`,
          {
            method: 'POST',
          },
        ),
      );

      const responses = await Promise.all(requests);
      const results = await Promise.all(
        responses.map(response => response.json()),
      );
      console.log('API Received Details');

      const newData = results.reduce(
        (acc, result) => [...acc, ...result.data],
        [],
      );

      setTransactionalInformation(prevData => ({
        ...prevData,
        receivedDetails: newData,
      }));
    } catch (error) {
      Alert.alert(
        'Failed',
        "Sorry can't get data Transactional Information, try again later",
        [
          {
            text: 'OK',
            onPress: () => console.log('Failed get data Total History'),
          },
        ],
      );
      setIsLoading(false);
    }
  };

  fetchData();
};

// ? Function Transition history
const transitionHistory = async (
  member,
  currencies,
  setTransactionalInformation,
  Alert,
) => {
  const fetchData = async () => {
    try {
      const requests = currencies.map(currency =>
        fetch(
          `${URL_API}&act=app4200-03&startwith=0&member=${member}&currency=${currency}&daysbefore=30`,
          {
            method: 'POST',
          },
        ),
      );

      console.log('API Transition History');

      const responses = await Promise.all(requests);
      const results = await Promise.all(
        responses.map(response => response.json()),
      );

      const newData = results.reduce(
        (acc, result) => [...acc, ...result.data],
        [],
      );

      setTransactionalInformation(prevData => ({
        ...prevData,
        transitionHistory: newData,
      }));
    } catch (error) {
      Alert.alert(
        'Failed',
        "Sorry can't get data Transactional Information, try again later",
        [
          {
            text: 'OK',
            onPress: () => console.log('Failed get data Total History'),
          },
        ],
      );
      setIsLoading(false);
    }
  };

  fetchData();
};
