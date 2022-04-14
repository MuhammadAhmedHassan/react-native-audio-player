/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
// Might work during production
// TrackPlayer.registerPlaybackService(() => require('./build/utilsAndServices/TrackPlayerService'));
// Working during development
TrackPlayer.registerPlaybackService(() =>
  require('./utilsAndServices/TrackPlayerSerivce'),
);
