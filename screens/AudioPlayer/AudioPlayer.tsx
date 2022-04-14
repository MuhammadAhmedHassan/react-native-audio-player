import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer, {
  Track,
  useProgress,
  State,
} from 'react-native-track-player';
import styles from './styles';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Fontisto';
import AppPlayer from '../../utilsAndServices/AppPlayer';

type compProps = {
  track: Track;
  onNextPrevPress: (p: 'prev' | 'next') => void;
};

const AudioPlayer = ({track, onNextPrevPress}: compProps) => {
  const progress = useProgress();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setIsPlaying(true);
    TrackPlayer.add(track);
    TrackPlayer.play();
  }, [track]);

  const onPlayPausePress = async () => {
    const state = await TrackPlayer.getState();

    if (state === State.Playing) {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
    if (state === State.Paused) {
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const artImg = (track.artwork ||
    `https://picsum.photos/150/200/?random=${Math.random()}`) as string;

  const playOrPauseIcon = isPlaying ? 'pause' : 'play';

  return (
    <View style={styles.playerMaxView}>
      <View style={styles.topSection}>
        <View style={styles.trackArtBox}>
          <Image style={styles.trackArt} source={{uri: artImg}} />
        </View>
        <View style={styles.trackDesc}>
          <View>
            <Text style={styles.trackTitle}>{track.title}</Text>
          </View>
          <View>
            <Text style={styles.trackSubtitle}>
              {track.artist || track.album || 'unknown'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progrsBarSection}>
        <Text>
          {AppPlayer.secondsToHHMMSS(Math.floor(progress.position || 0))}
        </Text>
        <Slider
          style={{width: '70%', height: 40}}
          minimumValue={0}
          maximumValue={track.duration}
          minimumTrackTintColor="#52527a"
          maximumTrackTintColor="#52527a"
          thumbTintColor="#52527a"
          value={progress.position}
        />
        <Text>{AppPlayer.secondsToHHMMSS(track.duration || 0)}</Text>
      </View>

      <View style={styles.buttonsSection}>
        <View style={[styles.buttonsCol, {alignItems: 'flex-end'}]}>
          <TouchableOpacity onPress={() => onNextPrevPress('prev')}>
            <Icon name="step-backwrad" size={18} color="#52527a" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsCol}>
          <TouchableOpacity
            onPress={onPlayPausePress}
            style={styles.playPauseButton}>
            <Icon
              name={playOrPauseIcon}
              size={14}
              color="#000"
              style={styles.playPauseIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonsCol, {alignItems: 'flex-start'}]}>
          <TouchableOpacity onPress={() => onNextPrevPress('next')}>
            <Icon name="step-forward" size={18} color="#52527a" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
