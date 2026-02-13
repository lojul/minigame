import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.minigamesarcade.app',
  appName: 'Mini Games Arcade',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
  },
};

export default config;
