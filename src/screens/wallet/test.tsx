// // import React from 'react';
// // import {Text} from 'react-native';
// // type Props = {};

// // const Wallet = (props: Props) => {
// //   return <Text>Wallet</Text>;
// // };

// // export default Wallet;

// // import React, { useState } from 'react';
// // import { View, Button, Alert, Platform, PermissionsAndroid } from 'react-native';
// // // @ts-ignore
// // import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';


// // const Wallet = () => {
// //   const [isConnected, setIsConnected] = useState(false);

// //   const requestPermissions = async () => {
// //     if (Platform.OS === 'android') {
// //       const permissions:any[] = [
// //         'android.permission.BLUETOOTH_CONNECT',
// //         'android.permission.BLUETOOTH_SCAN',
// //         'android.permission.ACCESS_FINE_LOCATION',
// //       ];
      
// //       try {
// //         const granted = await PermissionsAndroid.requestMultiple(permissions);
// //         return Object.values(granted).every(
// //           permission => permission === PermissionsAndroid.RESULTS.GRANTED
// //         );
// //       } catch (err:any) {
// //         Alert.alert('Permission Error', err.message);
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const scanPrinters = async () => {
// //     try {
// //       const hasPermission = await requestPermissions();
// //       if (!hasPermission) return;

// //       await BluetoothManager.enableBluetooth();
// //       const devices = await BluetoothManager.scanDevices();
// //       const unpaired = devices.found || [];
// //       const paired = devices.paired || [];
// //       return [...unpaired, ...paired];
// //     } catch (error:any) {
// //       Alert.alert('Error', error.message);
// //       return [];
// //     }
// //   };

// //   const connectPrinter = async (address:string) => {
// //     try {
// //       await BluetoothManager.connect(address);
// //       setIsConnected(true);
// //       return true;
// //     } catch (error:any) {
// //       Alert.alert('Connection Error', error.message);
// //       return false;
// //     }
// //   };

// //   const printReceipt = async () => {
// //     try {
// //       await BluetoothEscposPrinter.printerInit();
// //       await BluetoothEscposPrinter.printText("Receipt\n\r", {
// //         encoding: 'GBK',
// //         codepage: 0,
// //         widthtimes: 1,
// //         heigthtimes: 1,
// //         fonttype: 1
// //       });
// //       await BluetoothEscposPrinter.printText("------------------------\n\r");
      
// //       // Print items
// //       await BluetoothEscposPrinter.printColumn(
// //         [32],
// //         [BluetoothEscposPrinter.ALIGN.LEFT],
// //         ["Item 1               $10.00\n\r"]
// //       );
      
// //       await BluetoothEscposPrinter.printText("------------------------\n\r");
// //       await BluetoothEscposPrinter.printText("Total: $10.00\n\r");
// //       await BluetoothEscposPrinter.printText("\n\r\n\r");
// //     } catch (error:any) {
// //       Alert.alert('Printing Error', error.message);
// //     }
// //   };

// //   const scanAndConnect = async () => {
// //     const devices:any = await scanPrinters();
// //     if (devices.length > 0) {
// //       // Connect to first available printer
// //       await connectPrinter(devices[0].address);
// //     } else {
// //       Alert.alert('No printers found');
// //     }
// //   };

// //   return (
// //     <View>
// //       <Button 
// //         title="Scan & Connect Printer" 
// //         onPress={scanAndConnect} 
// //       />
// //       {isConnected && (
// //         <Button 
// //           title="Print Receipt" 
// //           onPress={printReceipt} 
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // export default Wallet;

// // import React, { useEffect, useState } from 'react';
// // import { View, Button, Platform, Alert } from 'react-native';
// // import { BleManager } from 'react-native-ble-plx'; // For Bluetooth functionality
// // import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'; // For permission handling
// // import RNPrint from 'react-native-print'; // For printing functionality

// // // Instantiate the BleManager
// // const bleManager = new BleManager();

// // const Wallet: React.FC = () => {
// //   const [isBluetoothEnabled, setBluetoothEnabled] = useState<boolean>(false);

// //   // Request necessary Bluetooth permissions
// //   const checkBluetoothPermissions = async () => {
// //     if (Platform.OS === 'android') {
// //       // Android 12+ (API level 31+) requires specific Bluetooth permissions
// //       if (Platform.Version >= 31) {
// //         const bluetoothConnectPermission = await check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
// //         if (bluetoothConnectPermission !== RESULTS.GRANTED) {
// //           const result = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
// //           if (result !== RESULTS.GRANTED) {
// //             Alert.alert('Bluetooth Permission', 'Bluetooth permission is required to connect and print.');
// //             return false;
// //           }
// //         }

// //         const bluetoothScanPermission = await check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
// //         if (bluetoothScanPermission !== RESULTS.GRANTED) {
// //           const result = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
// //           if (result !== RESULTS.GRANTED) {
// //             Alert.alert('Bluetooth Permission', 'Bluetooth scanning permission is required to find devices.');
// //             return false;
// //           }
// //         }

// //         const locationPermission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
// //         if (locationPermission !== RESULTS.GRANTED) {
// //           const locationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
// //           if (locationResult !== RESULTS.GRANTED) {
// //             Alert.alert('Location Permission', 'Location permission is required to scan for Bluetooth devices.');
// //             return false;
// //           }
// //         }

// //       } else {
// //         const grantedCoarse = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
// //         if (grantedCoarse !== RESULTS.GRANTED) {
// //           Alert.alert('Location Permission', 'Location permission is required to scan for Bluetooth devices.');
// //           return false;
// //         }
// //       }
// //     } else if (Platform.OS === 'ios') {
// //       const bluetoothPermission = await check(PERMISSIONS.IOS.BLUETOOTH);
// //       if (bluetoothPermission !== RESULTS.GRANTED) {
// //         const result = await request(PERMISSIONS.IOS.BLUETOOTH);
// //         if (result !== RESULTS.GRANTED) {
// //           Alert.alert('Bluetooth Permission', 'Bluetooth permission is required to print via Bluetooth.');
// //           return false;
// //         }
// //       }

// //       const locationPermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
// //       if (locationPermission !== RESULTS.GRANTED) {
// //         const locationResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
// //         if (locationResult !== RESULTS.GRANTED) {
// //           Alert.alert('Location Permission', 'Location permission is required to scan for Bluetooth devices.');
// //           return false;
// //         }
// //       }
// //     }
// //     return true;
// //   };

// //   // Function to check if Bluetooth is enabled
// //   const checkBluetoothStatus = async () => {
// //     const hasPermission = await checkBluetoothPermissions();
// //     if (hasPermission) {
// //       // Check the Bluetooth state using react-native-ble-plx
// //       bleManager.state().then(state => {
// //         if (state === 'PoweredOn') {
// //           setBluetoothEnabled(true);
// //           console.log('Bluetooth is enabled');
// //         } else {
// //           setBluetoothEnabled(false);
// //           console.log('Bluetooth is not enabled');
// //           Alert.alert('Bluetooth is off', 'Please enable Bluetooth to continue.');
// //         }
// //       });
// //     }
// //   };

// //   // Function to handle printing receipt
// //   const printReceipt = async () => {
// //     try {
// //       const results = await RNPrint.print({
// //         html: `
// //           <div style="font-family: Arial; text-align: center; padding: 20px;">
// //             <h1>Receipt</h1>
// //             <p>Date: ${new Date().toLocaleString()}</p>
// //             <table style="width: 100%; border-collapse: collapse;">
// //               <tr>
// //                 <th style="border: 1px solid black; padding: 5px;">Item</th>
// //                 <th style="border: 1px solid black; padding: 5px;">Price</th>
// //               </tr>
// //               <tr>
// //                 <td style="border: 1px solid black; padding: 5px;">Product 1</td>
// //                 <td style="border: 1px solid black; padding: 5px;">$10.00</td>
// //               </tr>
// //               <tr>
// //                 <td style="border: 1px solid black; padding: 5px;">Product 2</td>
// //                 <td style="border: 1px solid black; padding: 5px;">$15.00</td>
// //               </tr>
// //               <tr>
// //                 <td style="border: 1px solid black; padding: 5px;"><strong>Total</strong></td>
// //                 <td style="border: 1px solid black; padding: 5px;"><strong>$25.00</strong></td>
// //               </tr>
// //             </table>
// //           </div>
// //         `,
// //       });
// //       console.log('Print results:', results);
// //     } catch (error) {
// //       console.error('Printing error:', error);
// //     }
// //   };

// //   // On component mount, check Bluetooth permissions and status
// //   useEffect(() => {
// //     checkBluetoothStatus();
// //   }, []);

// //   return (
// //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //       <Button 
// //         title="Print Receipt" 
// //         onPress={printReceipt} 
// //         disabled={!isBluetoothEnabled} 
// //       />
// //     </View>
// //   );
// // };

// // export default Wallet;
// import React, { useEffect, useState } from 'react';
// import { View, Button, Platform, Alert, Text } from 'react-native';
// import { BleManager, Device } from 'react-native-ble-plx';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import RNPrint from 'react-native-print';

// const bleManager = new BleManager();

// const BluetoothPrinter: React.FC = () => {
//   const [isBluetoothEnabled, setBluetoothEnabled] = useState<boolean>(false);
//   const [printers, setPrinters] = useState<Device[]>([]);
//   const [selectedPrinter, setSelectedPrinter] = useState<Device | null>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);

  // const checkBluetoothPermissions = async () => {
  //   if (Platform.OS === 'android') {
  //     if (Platform.Version >= 31) {
  //       const permissions = [
  //         PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  //         PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  //         PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  //       ];

  //       for (const permission of permissions) {
  //         const result = await request(permission);
  //         if (result !== RESULTS.GRANTED) {
  //           Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
  //           return false;
  //         }
  //       }
  //     } else {
  //       const result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
  //       if (result !== RESULTS.GRANTED) {
  //         Alert.alert('Permission Required', 'Location permission is required for Bluetooth functionality');
  //         return false;
  //       }
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     const permissions = [
  //       PERMISSIONS.IOS.BLUETOOTH,
  //       PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  //     ];

  //     for (const permission of permissions) {
  //       const result = await request(permission);
  //       if (result !== RESULTS.GRANTED) {
  //         Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // };

//   const scanForPrinters = async () => {
//     const hasPermission = await checkBluetoothPermissions();
//     if (!hasPermission) return;

//     setIsScanning(true);
//     setPrinters([]);

//     try {
//       bleManager.startDeviceScan(null, null, (error, device) => {
//         if (error) {
//           console.error('Scanning error:', error);
//           Alert.alert('Scanning Error', error.message);
//           setIsScanning(false);
//           return;
//         }

//         if (device) {
//           // Add logic here to filter for printer devices
//           // This might involve checking device.name or device.serviceUUIDs
//           // The exact filter will depend on your printer's specifications
//           setPrinters(prevPrinters => {
//             if (!prevPrinters.find(p => p.id === device.id)) {
//               return [...prevPrinters, device];
//             }
//             return prevPrinters;
//           });
//         }
//       });

//       // Stop scanning after 10 seconds
//       setTimeout(() => {
//         bleManager.stopDeviceScan();
//         setIsScanning(false);
//       }, 10000);
//     } catch (error) {
//       console.error('Scan error:', error);
//       setIsScanning(false);
//     }
//   };

//   const connectToPrinter = async (printer: Device) => {
//     try {
//       const connectedDevice = await printer.connect();
//       setSelectedPrinter(connectedDevice);
//       Alert.alert('Success', `Connected to ${printer.name || 'printer'}`);
//     } catch (error) {
//       console.error('Connection error:', error);
//       Alert.alert('Connection Error', 'Failed to connect to printer');
//     }
//   };

//   const printReceipt = async () => {
//     if (!selectedPrinter) {
//       Alert.alert('Error', 'Please select a printer first');
//       return;
//     }

//     try {
//       // For iOS, you might want to use RNPrint.selectPrinter first
//       if (Platform.OS === 'ios') {
//         const printer = await RNPrint.selectPrinter({ x: '100', y: '100' });  // Changed to strings
//         if (!printer) return;
//       }

//       const results = await RNPrint.print({
//         html: `
//           <div style="font-family: Arial; text-align: center; padding: 20px;">
//             <h1>Receipt</h1>
//             <p>Date: ${new Date().toLocaleString()}</p>
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <th style="border: 1px solid black; padding: 5px;">Item</th>
//                 <th style="border: 1px solid black; padding: 5px;">Price</th>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid black; padding: 5px;">Product 1</td>
//                 <td style="border: 1px solid black; padding: 5px;">$10.00</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid black; padding: 5px;">Product 2</td>
//                 <td style="border: 1px solid black; padding: 5px;">$15.00</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid black; padding: 5px;"><strong>Total</strong></td>
//                 <td style="border: 1px solid black; padding: 5px;"><strong>$25.00</strong></td>
//               </tr>
//             </table>
//           </div>
//         `,
//       });
//       console.log('Print results:', results);
//     } catch (error) {
//       console.error('Printing error:', error);
//       Alert.alert('Printing Error', 'Failed to print receipt');
//     }
//   };

//   useEffect(() => {
//     bleManager.state().then(state => {
//       setBluetoothEnabled(state === 'PoweredOn');
//     });

//     return () => {
//       bleManager.destroy();
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//       <Button
//         title={isScanning ? "Scanning..." : "Scan for Printers"}
//         onPress={scanForPrinters}
//         disabled={!isBluetoothEnabled || isScanning}
//       />
      
//       {printers.map(printer => (
//         <Button
//           key={printer.id}
//           title={`Connect to ${printer.name || 'Unknown Printer'}`}
//           onPress={() => connectToPrinter(printer)}
//           disabled={isScanning}
//         />
//       ))}

//       <Button
//         title="Print Receipt"
//         onPress={printReceipt}
//         disabled={!selectedPrinter}
//       />

//       {selectedPrinter && (
//         <Text>Connected to: {selectedPrinter.name || 'Unknown Printer'}</Text>
//       )}
//     </View>
//   );
// };

// export default BluetoothPrinter;
import React, { useEffect, useState } from 'react';
import { View, Button, Platform, Alert, Text, ScrollView, StyleSheet } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNPrint from 'react-native-print';

const bleManager = new BleManager();

// Common printer service UUIDs and name patterns
const PRINTER_PATTERNS = [
  'print', 'epson', 'zebra', 'star', 'tsp', 'pos', 'thermal'
];

const BluetoothPrinter: React.FC = () => {
  const [isBluetoothEnabled, setBluetoothEnabled] = useState<boolean>(false);
  const [printers, setPrinters] = useState<Device[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const isPrinterDevice = (device: Device): boolean => {
    const deviceName = (device.name || '').toLowerCase();
    const localName = (device.localName || '').toLowerCase();
    
    // Check if the device name matches any known printer patterns
    return PRINTER_PATTERNS.some(pattern => 
      deviceName.includes(pattern) || localName.includes(pattern)
    );
  };

  const checkBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const permissions = [
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        ];

        for (const permission of permissions) {
          const result = await request(permission);
          if (result !== RESULTS.GRANTED) {
            Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
            return false;
          }
        }
      } else {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        if (result !== RESULTS.GRANTED) {
          Alert.alert('Permission Required', 'Location permission is required for Bluetooth functionality');
          return false;
        }
      }
    } else if (Platform.OS === 'ios') {
      const permissions = [
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      ];

      for (const permission of permissions) {
        const result = await request(permission);
        if (result !== RESULTS.GRANTED) {
          Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
          return false;
        }
      }
    }
    return true;
  };


  const scanForPrinters = async () => {
    const hasPermission = await checkBluetoothPermissions();
    if (!hasPermission) return;

    setIsScanning(true);
    setPrinters([]);

    try {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scanning error:', error);
          Alert.alert('Scanning Error', error.message);
          setIsScanning(false);
          return;
        }

        if (device && device.name) {  // Only add devices with names
          console.log('Found device:', device.name, device.localName, device.serviceUUIDs);
          
          // Only add if it's likely a printer
          if (isPrinterDevice(device)) {
            setPrinters(prevPrinters => {
              if (!prevPrinters.find(p => p.id === device.id)) {
                return [...prevPrinters, device];
              }
              return prevPrinters;
            });
          }
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
        
        // If no printers found, show message
        if (printers.length === 0) {
          Alert.alert('No Printers', 'No Bluetooth printers were found. Please make sure your printer is turned on and in range.');
        }
      }, 10000);
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
    }
  };

  const connectToPrinter = async (printer: Device) => {
    try {
      const connectedDevice = await printer.connect();
      setSelectedPrinter(connectedDevice);
      Alert.alert('Success', `Connected to ${printer.name || printer.localName || 'printer'}`);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Error', 'Failed to connect to printer. Please try again.');
    }
  };

  const printReceipt = async () => {
    if (!selectedPrinter) {
      Alert.alert('Error', 'Please select a printer first');
      return;
    }

    try {
      // if (Platform.OS === 'ios') 
      //   {
      //   const printer = await RNPrint.selectPrinter({ x: '100', y: '100' });
      //   if (!printer) return;
      // }

      const results = await RNPrint.print({
        html: `
          <div style="font-family: Arial; text-align: center; padding: 20px;">
            <h1>Receipt</h1>
            <p>Date: ${new Date().toLocaleString()}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="border: 1px solid black; padding: 5px;">Item</th>
                <th style="border: 1px solid black; padding: 5px;">Price</th>
              </tr>
              <tr>
                <td style="border: 1px solid black; padding: 5px;">Product 1</td>
                <td style="border: 1px solid black; padding: 5px;">$10.00</td>
              </tr>
              <tr>
                <td style="border: 1px solid black; padding: 5px;">Product 2</td>
                <td style="border: 1px solid black; padding: 5px;">$15.00</td>
              </tr>
              <tr>
                <td style="border: 1px solid black; padding: 5px;"><strong>Total</strong></td>
                <td style="border: 1px solid black; padding: 5px;"><strong>$25.00</strong></td>
              </tr>
            </table>
          </div>
        `,
      });
      console.log('Print results:', results);
    } catch (error) {
      console.error('Printing error:', error);
      Alert.alert('Printing Error', 'Failed to print receipt');
    }
  };

  useEffect(() => {
    bleManager.state().then(state => {
      setBluetoothEnabled(state === 'PoweredOn');
      if (state !== 'PoweredOn') {
        Alert.alert('Bluetooth Required', 'Please enable Bluetooth to use this feature');
      }
    });

    return () => {
      bleManager.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title={isScanning ? "Scanning..." : "Scan for Printers"}
          onPress={scanForPrinters}
          disabled={!isBluetoothEnabled || isScanning}
        />
      </View>

      <ScrollView style={styles.printerList} contentContainerStyle={styles.printerListContent}>
        {printers.length === 0 && !isScanning && (
          <Text style={styles.noDevicesText}>
            No printers found. Tap 'Scan for Printers' to search.
          </Text>
        )}
        
        {printers.map(printer => (
          <View key={printer.id} style={styles.printerItem}>
            <Text style={styles.printerName}>
              {printer.name || printer.localName || 'Unknown Printer'}
            </Text>
            <Text style={styles.printerInfo}>
              Signal Strength: {printer.rssi || 'N/A'}
            </Text>
            <Button
              title={selectedPrinter?.id === printer.id ? "Connected" : "Connect"}
              onPress={() => connectToPrinter(printer)}
              disabled={isScanning || selectedPrinter?.id === printer.id}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Print Receipt"
          onPress={printReceipt}
          disabled={!selectedPrinter}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 10,
  },
  printerList: {
    flex: 1,
    marginVertical: 10,
  },
  printerListContent: {
    paddingHorizontal: 10,
  },
  printerItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  printerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  printerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  footer: {
    padding: 10,
  },
  noDevicesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  }
});

export default BluetoothPrinter;