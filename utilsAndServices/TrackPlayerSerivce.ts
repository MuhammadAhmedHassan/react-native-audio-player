import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play(),
  );
  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => await TrackPlayer.pause(),
  );
  TrackPlayer.addEventListener(
    Event.RemoteStop,
    async () => await TrackPlayer.destroy(),
  );
};
