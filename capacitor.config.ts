
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.86a6094dc7584efa9688890a8a54f068',
  appName: 'majlis-e-amali-rooznamcha',
  webDir: 'dist',
  server: {
    url: 'https://86a6094d-c758-4efa-9688-890a8a54f068.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
