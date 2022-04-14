import {
  FlatList,
  Image,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer, {Track} from 'react-native-track-player';
import {tracks} from '../../utilsAndServices/tracks';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../utilsAndServices/utils';
import AppPlayer from '../../utilsAndServices/AppPlayer';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import styles from './styles';

const TracksList = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  useEffect(() => {
    AppPlayer.initializePlayer();
  }, []);

  const onTrackItemPress = async (track: Track) => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    setSelectedTrack(track);
  };

  const playNextPrev = async (prevOrNext: 'prev' | 'next') => {
    const currentTrackId = await TrackPlayer.getCurrentTrack();
    if (!currentTrackId) return;
    const trkIndex = tracks.findIndex(trk => trk.id === currentTrackId);

    if (prevOrNext === 'next' && trkIndex < tracks.length - 1) {
      onTrackItemPress(tracks[trkIndex + 1]);
    }
    if (prevOrNext === 'prev' && trkIndex > 0) {
      onTrackItemPress(tracks[trkIndex - 1]);
    }
  };

  const renderItem: ListRenderItem<Track> = ({item}) => {
    const artImg = (item.artwork ||
      `https://picsum.photos/150/200/?random=${Math.random()}`) as string;

    let highlightStyle = {};
    if (selectedTrack && selectedTrack.id === item.id) {
      highlightStyle = {backgroundColor: '#d1d1e0'};
    }

    return (
      <TouchableOpacity
        onPress={() => onTrackItemPress(item)}
        style={[styles.itemStyle, highlightStyle]}>
        <View style={styles.trackImgBox}>
          <Image style={styles.trackImg} source={{uri: artImg}} />
        </View>
        <View style={styles.trackDescBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.subTitleBox}>
            <Text style={styles.subTitle}>
              {item.artist || item.album || 'Unknown'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  let listBoxStyle = {};
  if (selectedTrack) listBoxStyle = {paddingBottom: verticalScale(280)};

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.listBox, listBoxStyle]}>
        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      {selectedTrack && (
        <View style={styles.playerBox}>
          <AudioPlayer track={selectedTrack} onNextPrevPress={playNextPrev} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default TracksList;
