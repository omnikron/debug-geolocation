import {useEffect, useState} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
//
const DISTANCE_FILTER = 5;

const config = {
  activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER,
  backgroundPermissionRationale: {
    title: 'Continue recording if FATMAP is killed?',
    message:
      "To ensure recording continues even if your phone kills FATMAP, please enable the '{backgroundPermissionOptionLabel}' location permission",
    positiveAction: "Change to '{backgroundPermissionOptionLabel}'",
    negativeAction: 'Cancel',
  },
  debug: __DEV__,
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  desiredOdometerAccuracy: 20, // 10m is recommended in documentation but we need this to match recording filter
  disableLocationAuthorizationAlert: true,
  disableMotionActivityUpdates: true,
  disableStopDetection: true,
  distanceFilter: DISTANCE_FILTER,
  locationAuthorizationAlert: {
    titleWhenNotEnabled: 'Location services not enabled',
    titleWhenOff: 'Location services are off',
    instructions:
      "Location/Recording will not work properly unless you set 'Location' to 'When In Use' or 'Always'",
    cancelButton: 'Cancel',
    settingsButton: 'Open Settings',
  },
  locationAuthorizationRequest: 'WhenInUse',
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  stationaryRadius: 25,
};

const useBackgroundLocation = () => {
  const [position, setPosition] = useState(undefined);

  // We don't know about the state, until the callback on BackgroundGeolocation.ready is fired
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
    // This hook MUST only ever run once. No deps!
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
    console.log('- BackgroundGeolocation start');
    BackgroundGeolocation.start(() => {
      console.log('- BackgroundGeolocation started');
      setGeolocationIsStarted(true);
      BackgroundGeolocation.changePace(true);
    });
  }, []);
};

export default useBackgroundLocation;
