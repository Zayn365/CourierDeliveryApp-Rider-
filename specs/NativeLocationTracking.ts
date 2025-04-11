// // // import type { TurboModule } from 'react-native';
// // // import { TurboModuleRegistry } from 'react-native';

// // // export interface Spec extends TurboModule {
// // //   startBackgroundTracking(interval: number): void;
// // //   stopBackgroundTracking(): void;
// // //   // getCurrentPosition(callback: (latitude: number, longitude: number) => void): void;
// // //   getCurrentPosition(): Promise<{ latitude: number; longitude: number }>;
// // // }

// // // export default TurboModuleRegistry.get<Spec>('NativeLocationTracking');

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // startBackgroundTracking(interval: number): void;
  startBackgroundTracking(interval: number, userId: string): void;
  stopBackgroundTracking(): void;
  getCurrentPosition(): Promise<{
    latitude: number; longitude: number, timestamp?: number
  }>;
}

export default TurboModuleRegistry.get<Spec>('NativeLocationTracking');


// // // specs/NativeLocationTracking.ts
// // import { TurboModule, TurboModuleRegistry } from 'react-native';

// // export interface ServiceConfig {
// //   interval: number;
// //   userId: string;
// // }

// // export interface LocationUpdate {
// //   latitude: number;
// //   longitude: number;
// //   accuracy: number;
// //   timestamp: number;
// //   heading?: number;
// // }

// // export interface Spec extends TurboModule {
// //   startBackgroundTracking(config: ServiceConfig, onLocationUpdate: (update: LocationUpdate) => void): Promise<void>;
// //   stopBackgroundTracking(): Promise<void>;
// //   getCurrentPosition(): Promise<LocationUpdate>;
// // }

// // export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocationTracking');

// import type { TurboModule } from 'react-native';
// import { TurboModuleRegistry } from 'react-native';

// export interface Spec extends TurboModule {
//   startBackgroundTracking(interval: number, userId: string): Promise<boolean>;
//   stopBackgroundTracking(): void;
//   getCurrentPosition(): Promise<{ latitude: number; longitude: number; timestamp?: number }>;
//   requestBatteryOptimizationsExemption(): Promise<boolean>;
// }

// export default TurboModuleRegistry.get<Spec>('NativeLocationTracking');