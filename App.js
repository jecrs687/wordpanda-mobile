import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, StyleSheet, Text, View, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';
import app from './app.json'
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { setStatusBarHidden } from 'expo-status-bar';
import { setVisibilityAsync } from 'expo-navigation-bar';
import { useEffect } from 'react';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export default function App() {

  const values = {
    device: 'Mobile',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    os: Platform.OS,
    version: Platform.Version,
    devicePixelRatio: Dimensions.get('window').scale,
    appVersion: app.expo.version,
    statusBarHeight: STATUSBAR_HEIGHT,
  }
  const query = Object.keys(values).map(key => `${key}=${values[key]}`).join('&');
  useEffect(() => {
    setStatusBarHidden(true)
    setVisibilityAsync('hidden')
  }, [])
  const functions = {
    sharing: (values) => {
      Sharing.shareAsync(...values)
    },
    linking: (values) => {
      Linking.openURL(...values)
    },
    vibration: (values) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle[values])
    },
    setStatusBarHidden: (values) => {
      setStatusBarHidden(values)
    },
    setNavigationVisibility: (value) => {
      setVisibilityAsync(!value ? 'hidden' : 'visible')
    },


  }

  return (

    <WebView
      style={{
        ...styles.container,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      source={{
        uri: `https://wordpanda.app/?${query}`
      }}
      webviewDebuggingEnabled={true}
      allowFileAccess={true}
      allowsAirPlayForMediaPlayback={true}
      allowsFullscreenVideo={true}
      allowFileAccessFromFileURLs={true}
      scrollEnabled={false}
      setBuiltInZoomControls={false}
      setDisplayZoomControls={false}
      automaticallyAdjustContentInsets={false}
      renderLoading={() => <View style={styles.container}><Text>Loading...</Text></View>}
      bounces={false}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          functions?.[data.name]?.(data.content)
        } catch (e) {
          console.log(e);
        }
      }}
      cacheEnabled={true}
      cacheMode='LOAD_DEFAULT'
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
