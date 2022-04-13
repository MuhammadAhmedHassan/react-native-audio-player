import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
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
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {songs} from './model/data';

const {width, height} = Dimensions.get('window');

const App = () => {
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

  useEffect(() => {
    scrollX.addListener(({value}) => {
      console.log('value', value);
      console.log('scrollX', scrollX);

      const index = Math.round(value / width);
      console.log('index', index);
      setAudioIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const getIcon = (
    name: string,
    size = 30,
    color = '#777777',
    onPress?: () => void,
    disabled = false,
  ) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Ionicons
        name={name}
        size={size}
        color={color}
        style={{opacity: disabled ? 0.5 : 1}}
      />
    </TouchableOpacity>
  );

  const renderAudio = ({
    index,
    item,
  }: {
    index: number;
    item: typeof audios[0];
  }) => {
    return (
      <Animated.View
        style={{width, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.artworkWrapper}>
          <Image source={item.url} style={styles.artworkImg} />
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
          <Text style={styles.title}>{audios[audioIndex].title}</Text>
          <Text style={styles.artist}>{audios[audioIndex].artist}</Text>
        </View>

        <View>
          <Slider
            style={styles.progressContainer}
            // value={progress.position}
            value={0}
            minimumValue={0}
            // maximumValue={progress.duration}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              // await TrackPlayer.seekTo(value);
            }}
          />
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelTxt}>
              00:00
              {/* {new Date(progress.position * 1000).toISOString().substr(14, 5)} */}
            </Text>
            <Text style={styles.progressLabelTxt}>
              3:00
              {/* {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)} */}
            </Text>
          </View>
        </View>

        <View style={styles.audioControls}>
          {getIcon(
            'play-skip-back-outline',
            35,
            '#FFD369',
            previousAudio,
            audioIndex === 0,
          )}
          {getIcon(
            // playbackState === State.Playing
            true ? 'ios-pause-circle' : 'ios-play-circle',
            75,
            '#FFD369',
            // handlePlayPause,
          )}
          {getIcon(
            'play-skip-forward-outline',
            35,
            '#FFD369',
            nextAudio,
            audioIndex === audios.length - 1,
          )}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {getIcon('heart-outline')}
        {getIcon('repeat')}
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
