// Get Coin as Lat Lng
export const fetchMarkerData = async (latitude, longitude) => {
  try {
    const apiUrl = `https://app.xrun.run/gateway.php?act=coinmapping&member=1102&lat=${latitude}&lng=${longitude}&limit=30`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();

      // Filter only the properties you need
      const filteredData = data.data.map(item => ({
        coin: item.coin,
        // cointype: item.cointype,
        // amount: item.amount,
        lat: item.lat,
        lng: item.lng,
        distance: item.distance,
        advertisement: item.advertisement,
        brand: item.brand,
        title: item.title,
        // contents: item.contents,
        // currency: item.currency,
        // adcolor1: item.adcolor1,
        // adcolor2: item.adcolor2,
        coins: item.coins,
        // adthumbnail: item.adthumbnail,
        isbigcoin: item.isbigcoin,
        // symbol: item.symbol,
        // exad: item.exad,
        // exco: item.exco,
        // member: item.member,
        // lv: item.lv,
      }));

      return {data: filteredData};
    } else {
      console.error('Gagal mengambil data dari API');
      return null;
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  }
};
