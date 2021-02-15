/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Text} from 'react-native';
import useBackgroundLocation from 'useBackgroundLocation';

const App = () => {
  useBackgroundLocation();

  return <Text>Step One</Text>;
};

export default App;
