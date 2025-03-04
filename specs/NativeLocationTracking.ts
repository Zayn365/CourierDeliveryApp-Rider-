// import type { TurboModule } from 'react-native';
// import { TurboModuleRegistry } from 'react-native';

// export interface Spec extends TurboModule {
//   startBackgroundTracking(interval: number): void;
//   stopBackgroundTracking(): void;
//   // getCurrentPosition(callback: (latitude: number, longitude: number) => void): void;
//   getCurrentPosition(): Promise<{ latitude: number; longitude: number }>;
// }

// export default TurboModuleRegistry.get<Spec>('NativeLocationTracking');

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  startBackgroundTracking(interval: number): void;
  stopBackgroundTracking(): void;
  getCurrentPosition(): Promise<{ latitude: number; longitude: number }>;
}

export default TurboModuleRegistry.get<Spec>('NativeLocationTracking');