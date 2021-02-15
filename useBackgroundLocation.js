import {useEffect, useState} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';

const config = {
  debug: __DEV__,
  disableLocationAuthorizationAlert: true,
  locationAuthorizationRequest: 'WhenInUse',
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
};

const useBackgroundLocation = () => {
  const [position, setPosition] = useState(undefined);
  const [geolocationIsStarted, setGeolocationIsStarted] = useState(undefined);

  // @event location
  const onLocation = (location) => {
    const {coords} = location;
    if (coords) {
      const {latitude, longitude, accuracy} = coords;

      const userPosition = {
        latitude,
        longitude,
        accuracy,
      };

      if (userPosition) {
        setPosition(userPosition);
      }
    } else {
      setPosition(undefined);
    }
  };

  useEffect(() => {
    BackgroundGeolocation.ready(config, ({enabled}) => {
      console.log('BackgroundGeolocation.ready', {enabled});
      setGeolocationIsStarted(enabled);
    });
  }, []);

  useEffect(() => {
    BackgroundGeolocation.onLocation(onLocation, (error) => {
      console.warn('LocationError (background)', error);
    });

    return () => {
      BackgroundGeolocation.removeListeners();
    };
  }, []);

  useEffect(() => {
    if (geolocationIsStarted || geolocationIsStarted === undefined) {
      return;
    }

    BackgroundGeolocation.start(() => {
      console.log('- BackgroundGeolocation started');
      setGeolocationIsStarted(true);
      BackgroundGeolocation.changePace(true);
      BackgroundGeolocation.getCurrentPosition();
      BackgroundGeolocation.getCurrentPosition();
    });
  }, [geolocationIsStarted, setGeolocationIsStarted]);

  return position;
};

export default useBackgroundLocation;
