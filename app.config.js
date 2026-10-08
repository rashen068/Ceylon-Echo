const appJson = require('./app.json');

const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY;
const mapsPlugin = androidGoogleMapsApiKey || iosGoogleMapsApiKey
  ? [
      [
        'react-native-maps',
        {
          ...(androidGoogleMapsApiKey ? { androidGoogleMapsApiKey } : {}),
          ...(iosGoogleMapsApiKey ? { iosGoogleMapsApiKey } : {}),
        },
      ],
    ]
  : [];

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins: [...appJson.expo.plugins, ...mapsPlugin],
  },
};
