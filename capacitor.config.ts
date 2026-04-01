import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.machinerent3d.app',
  appName: 'MachineRent 3D',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
