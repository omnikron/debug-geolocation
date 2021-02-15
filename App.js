/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Text} from 'react-native';
import useBackgroundLocation from './useBackgroundLocation';

const App = () => {
  const position = useBackgroundLocation();

  return (
    <Text>
      {position
        ? `${position.latitude} ${position.longitude}`
        : 'Waiting for position'}
    </Text>
  );
};

export default App;
