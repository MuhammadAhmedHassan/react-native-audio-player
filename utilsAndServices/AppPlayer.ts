import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  Track,
} from 'react-native-track-player';
import {tracks} from './tracks';
class AppPlayer {
  static selectedTrack: Track | null;

  static initializePlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: false, // false=> music continues in background even when app is closed
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
        ],
      });

      // await TrackPlayer.setupPlayer();
    } catch (error) {
      console.log(error);
      // TODO: handle the error
    }
  };

  static secondsToHHMMSS = (seconds: number | string) => {
    // credits - https://stackoverflow.com/a/37096512
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
    const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
    const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
    return `${hrs}${mins}${scnds}`;
  };

  static addSongs = async () => {
    await TrackPlayer.add(tracks);
  };

  static togglePlayback = async (playbackState: State) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    console.log('currentTrack', currentTrack);

    // if (!currentTrack) return;
    if (playbackState === State.Paused) {
      await TrackPlayer.play();
    }

    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    }
  };

  static skipTo = async (trackIndex: number) => {
    const upperBound = trackIndex < tracks.length;
    const lowerBound = trackIndex >= 0;
    if (upperBound && lowerBound) await TrackPlayer.skip(trackIndex);
  };

  static getRepeatMode = (repeatMode: RepeatMode) => {
    if (repeatMode === RepeatMode.Off) return RepeatMode.Track;
    if (repeatMode === RepeatMode.Track) return RepeatMode.Queue;
    if (repeatMode === RepeatMode.Queue) return RepeatMode.Off;
    return RepeatMode.Off;
  };

  static getTrack = async (trackIndex: number) => {
    return TrackPlayer.getTrack(trackIndex);
  };
}

export default AppPlayer;
