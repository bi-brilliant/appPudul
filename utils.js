// * Get data Transactional information (Transfer history, received details, Transition history)
// ? Get data transfer history
export const transferHistory = (
  member,
  currency,
  setTransactionalInformation,
  setIsLoading,
  Alert,
) => {
  fetch(
    `https://app.xrun.run/gateway.php?act=app4200-06&startwith=0&member=${member}&currency=${currency}&daysbefore=30`,
    {
      method: 'POST',
    },
  )
    .then(response => response.json())
    .then(result => {
      setTransactionalInformation(prevData => [...prevData, ...result.data]);

      setIsLoading(false);
    })
    .catch(error => {
      Alert.alert('Failed', `${error}`, [
        {
          text: 'OK',
          onPress: () => console.log('Failed get data Transactional history'),
        },
      ]);
      setIsLoading(false);
    });
};
