import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  ImageSourcePropType,
  ListRenderItem,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  Capability,
  Event,
  State,
  RepeatMode,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {songs} from './model/data';
import AppPlayer from './utilsAndServices/AppPlayer';

const {width, height} = Dimensions.get('window');

type GetIconType = {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
};

const App = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const isDarkMode = useColorScheme() === 'dark';
  const scrollX = useRef(new Animated.Value(0)).current;
  const flastListRef = useRef<FlatList>(null);

  const randomIntFromInterval = (min = 0, max = 100) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const [audios, setAudios] = useState(
    songs.map(song => ({...song, seekPosition: randomIntFromInterval()})),
  );
  const [audioIndex, setAudioIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  const [trackArtwork, setTrackArtwork] = useState<string | number>('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackTitle, setTrackTitle] = useState('');

  useEffect(() => {
    AppPlayer.initializePlayer().then(() => {
      AppPlayer.addSongs();
    });

    scrollX.addListener(({value}) => {
      console.log('value', value);
      console.log('scrollX', scrollX);

      const index = Math.round(value / width);
      console.log('index', index);
      AppPlayer.skipTo(index);
      setAudioIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await AppPlayer.getTrack(event.nextTrack);
      if (track === null) return;
      const {title, artwork, artist} = track;
      if (title) setTrackTitle(title);
      if (artwork) setTrackArtwork(artwork);
      if (artist) setTrackArtist(artist);
    }
  });

  const getRepeatIcon = () => {
    if (repeatMode === RepeatMode.Off) return 'repeat-off';
    if (repeatMode === RepeatMode.Track) return 'repeat-once';
    if (repeatMode === RepeatMode.Queue) return 'repeat';
    return 'repeat-off';
  };

  const changeRepeatMode = () => {
    const nextMode = AppPlayer.getRepeatMode(repeatMode);
    setRepeatMode(nextMode);
    TrackPlayer.setRepeatMode(nextMode);
  };

  // prettier-ignore
  const getIcon = (name: string, size = 30, color = '#777777', onPress?: () => void, disabled = false) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Ionicons
        name={name}
        size={size}
        color={color}
        style={{opacity: disabled ? 0.5 : 1}}
      />
    </TouchableOpacity>
  );

  // prettier-ignore
  const getMaterialIcon = ({name, size = 30, color = '#777777', onPress, disabled = false}: GetIconType) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={{opacity: disabled ? 0.5 : 1}}
      />
    </TouchableOpacity>
  );

  const renderAudio: ListRenderItem<typeof audios[0]> = ({index, item}) => {
    return (
      <Animated.View
        style={{width, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.artworkWrapper}>
          <Image
            // source={item.url as ImageSourcePropType}
            source={trackArtwork as ImageSourcePropType}
            style={styles.artworkImg}
          />
        </View>
      </Animated.View>
    );
  };

  const previousAudio = () => {
    // 1st way
    // flastListRef.current?.scrollToIndex({
    //   index: Math.max(0, audioIndex - 1),
    //   animated: true,
    // });

    // 2nd way
    flastListRef.current?.scrollToOffset({
      offset: (audioIndex - 1) * width,
    });
  };

  const nextAudio = () => {
    // 1st way
    flastListRef.current?.scrollToIndex({
      index: Math.min(4, audioIndex + 1),
      animated: true,
    });

    // 2nd way
    // flastListRef.current?.scrollToOffset({
    //   offset: (audioIndex + 1) * width,
    // });
  };

  const repeatIconColor = repeatMode !== RepeatMode.Off ? '#ffd369' : '#777777';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.mainContainer}>
        <View style={{width}}>
          <Animated.FlatList
            ref={flastListRef}
            data={audios}
            // contentContainerStyle={{backgroundColor: 'pink'}}
            renderItem={renderAudio}
            keyExtractor={item => `audio-${item.id}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
          />
        </View>

        <View>
          <Text style={styles.title}>
            {/* {audios[audioIndex].title} */}
            {trackTitle}
          </Text>
          <Text style={styles.artist}>
            {/* {audios[audioIndex].artist} */}
            {trackArtist}
          </Text>
        </View>

        <View>
          <Slider
            style={styles.progressContainer}
            value={progress.position}
            // value={0}
            minimumValue={0}
            maximumValue={progress.duration}
            // maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              try {
                await TrackPlayer.seekTo(value);
              } catch (error) {
                console.log(error);
              }
            }}
          />
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelTxt}>
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.progressLabelTxt}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
        </View>

        <View style={styles.audioControls}>
          {
            // prettier-ignore
            getIcon('play-skip-back-outline', 35, '#FFD369', previousAudio, audioIndex === 0)
          }
          {
            // prettier-ignore
            getIcon(
              playbackState === State.Playing ? 'ios-pause-circle' : 'ios-play-circle',
              75, '#FFD369', () => {AppPlayer.togglePlayback(playbackState);}
            )
          }
          {
            // prettier-ignore
            getIcon('play-skip-forward-outline', 35, '#FFD369', nextAudio, audioIndex === audios.length - 1)
          }
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {getIcon('heart-outline')}
        {
          // prettier-ignore
          getMaterialIcon({name: getRepeatIcon(), onPress: changeRepeatMode, color: repeatIconColor})
        }
        {getIcon('share-outline')}
        {getIcon('ellipsis-horizontal')}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#222831'},
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 24,

    shadowColor: '#ccc',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 5,
  },
  artworkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eee',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#eee',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 24,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  progressLabelTxt: {
    color: '#fff',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 15,
  },
});

export default App;
