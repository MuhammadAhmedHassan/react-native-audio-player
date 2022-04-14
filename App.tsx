import {SafeAreaView, StatusBar, Text, View} from 'react-native';
import React from 'react';

import TracksList from './screens/TracksList/TracksList';
import styles from './styles';

const App = () => {
  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar backgroundColor={'#35427e'} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Player</Text>
      </View>
      <View style={styles.content}>
        <TracksList />
      </View>
    </SafeAreaView>
  );
};

export default App;
