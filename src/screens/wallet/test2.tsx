// import React, { useEffect, useState } from 'react';
// import { View, Button, Platform, Alert, Text, ScrollView, StyleSheet } from 'react-native';
// import { BleManager, Device } from 'react-native-ble-plx';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import RNPrint from 'react-native-print';

// const bleManager = new BleManager();

// // Common printer service UUIDs and name patterns
// const PRINTER_PATTERNS = [
//   'print', 'epson', 'zebra', 'star', 'tsp', 'pos', 'thermal'
// ];

// const BluetoothPrinter: React.FC = () => {
//   const [isBluetoothEnabled, setBluetoothEnabled] = useState<boolean>(false);
//   const [printers, setPrinters] = useState<Device[]>([]);
//   const [selectedPrinter, setSelectedPrinter] = useState<Device | null>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [printerURL, setPrinterURL] = useState<string | null>(null);


//   const isPrinterDevice = (device: Device): boolean => {
//     const deviceName = (device.name || '').toLowerCase();
//     const localName = (device.localName || '').toLowerCase();
    
//     // Check if the device name matches any known printer patterns
//     return PRINTER_PATTERNS.some(pattern => 
//       deviceName.includes(pattern) || localName.includes(pattern)
//     );
//   };

//   const checkBluetoothPermissions = async () => {
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 31) {
//         const permissions = [
//           PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
//           PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
//           PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//         ];

//         for (const permission of permissions) {
//           const result = await request(permission);
//           if (result !== RESULTS.GRANTED) {
//             Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
//             return false;
//           }
//         }
//       } else {
//         const result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
//         if (result !== RESULTS.GRANTED) {
//           Alert.alert('Permission Required', 'Location permission is required for Bluetooth functionality');
//           return false;
//         }
//       }
//     } else if (Platform.OS === 'ios') {
//       const permissions = [
//         PERMISSIONS.IOS.BLUETOOTH,
//         PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//       ];

//       for (const permission of permissions) {
//         const result = await request(permission);
//         if (result !== RESULTS.GRANTED) {
//           Alert.alert('Permission Required', `${permission} is required for Bluetooth functionality`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };


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

//         if (device && device.name) {  // Only add devices with names
//           console.log('Found device:', device.name, device.localName, device.serviceUUIDs);
          
//           // Only add if it's likely a printer
//           if (isPrinterDevice(device)) {
//             setPrinters(prevPrinters => {
//               if (!prevPrinters.find(p => p.id === device.id)) {
//                 return [...prevPrinters, device];
//               }
//               return prevPrinters;
//             });
//           }
//         }
//       });

//       // Stop scanning after 10 seconds
//       setTimeout(() => {
//         bleManager.stopDeviceScan();
//         setIsScanning(false);
        
//         // If no printers found, show message
//         if (printers.length === 0) {
//           Alert.alert('No Printers', 'No Bluetooth printers were found. Please make sure your printer is turned on and in range.');
//         }
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
//       Alert.alert('Success', `Connected to ${printer.name || printer.localName || 'printer'}`);
//     } catch (error) {
//       console.error('Connection error:', error);
//       Alert.alert('Connection Error', 'Failed to connect to printer. Please try again.');
//     }
//   };

//   // const printReceipt = async () => {
//   //   if (!selectedPrinter) {
//   //     Alert.alert('Error', 'Please select a printer first');
//   //     return;
//   //   }

//   //   try {
//   //     // if (Platform.OS === 'ios') 
//   //     //   {
//   //     //   const printer = await RNPrint.selectPrinter({ x: '100', y: '100' });
//   //     //   if (!printer) return;
//   //     // }

//   //     const results = await RNPrint.print({
//   //       html: `
//   //         <div style="font-family: Arial; text-align: center; padding: 20px;">
//   //           <h1>Receipt</h1>
//   //           <p>Date: ${new Date().toLocaleString()}</p>
//   //           <table style="width: 100%; border-collapse: collapse;">
//   //             <tr>
//   //               <th style="border: 1px solid black; padding: 5px;">Item</th>
//   //               <th style="border: 1px solid black; padding: 5px;">Price</th>
//   //             </tr>
//   //             <tr>
//   //               <td style="border: 1px solid black; padding: 5px;">Product 1</td>
//   //               <td style="border: 1px solid black; padding: 5px;">$10.00</td>
//   //             </tr>
//   //             <tr>
//   //               <td style="border: 1px solid black; padding: 5px;">Product 2</td>
//   //               <td style="border: 1px solid black; padding: 5px;">$15.00</td>
//   //             </tr>
//   //             <tr>
//   //               <td style="border: 1px solid black; padding: 5px;"><strong>Total</strong></td>
//   //               <td style="border: 1px solid black; padding: 5px;"><strong>$25.00</strong></td>
//   //             </tr>
//   //           </table>
//   //         </div>
//   //       `,
//   //     });
//   //     console.log('Print results:', results);
//   //   } catch (error) {
//   //     console.error('Printing error:', error);
//   //     Alert.alert('Printing Error', 'Failed to print receipt');
//   //   }
//   // };

//   const printReceipt = async () => {
//     try {
//         console.log('Opening Print Dialog...');

//         let printerURL = null;

//         // iOS-specific logic: Select printer
//         if (Platform.OS === 'ios') {
//             const printer = await RNPrint.selectPrinter({ x: '100', y: '100' });
//             if (!printer) {
//                 Alert.alert('Error', 'No printer selected. Please select a printer and try again.');
//                 return;
//             }
//             printerURL = printer.url;
//             console.log('Selected Printer:', printer);
//         }

//         // Print on both iOS and Android
//         await RNPrint.print({
//             printerURL: printerURL, // Only applies on iOS
//             html: `<div style="font-family: Arial; text-align: center; padding: 20px;">
//                       <h1>Receipt</h1>
//                       <p>Date: ${new Date().toLocaleString()}</p>
//                       <table style="width: 100%; border-collapse: collapse;">
//                         <tr>
//                           <th style="border: 1px solid black; padding: 5px;">Item</th>
//                           <th style="border: 1px solid black; padding: 5px;">Price</th>
//                         </tr>
//                         <tr>
//                           <td style="border: 1px solid black; padding: 5px;">Product 1</td>
//                           <td style="border: 1px solid black; padding: 5px;">$10.00</td>
//                         </tr>
//                       </table>
//                    </div>`,
//                    isLandscape: false,  // Helps format correctly
//                    jobName: "Receipt Print", // Name of the print job
//         });

//     } catch (error) {
//         console.error('Printing error:', error);
//         Alert.alert('Printing Error', 'Failed to print receipt. Ensure the printer is connected and try again.');
//     }
// };


//   useEffect(() => {
//     bleManager.state().then(state => {
//       setBluetoothEnabled(state === 'PoweredOn');
//       if (state !== 'PoweredOn') {
//         Alert.alert('Bluetooth Required', 'Please enable Bluetooth to use this feature');
//       }
//     });

//     return () => {
//       bleManager.destroy();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Button
//           title={isScanning ? "Scanning..." : "Scan for Printers"}
//           onPress={scanForPrinters}
//           disabled={!isBluetoothEnabled || isScanning}
//         />
//       </View>

//       <ScrollView style={styles.printerList} contentContainerStyle={styles.printerListContent}>
//         {printers.length === 0 && !isScanning && (
//           <Text style={styles.noDevicesText}>
//             No printers found. Tap 'Scan for Printers' to search.
//           </Text>
//         )}
        
//         {printers.map(printer => (
//           <View key={printer.id} style={styles.printerItem}>
//             <Text style={styles.printerName}>
//               {printer.name || printer.localName || 'Unknown Printer'}
//             </Text>
//             <Text style={styles.printerInfo}>
//               Signal Strength: {printer.rssi || 'N/A'}
//             </Text>
//             <Button
//               title={selectedPrinter?.id === printer.id ? "Connected" : "Connect"}
//               onPress={() => connectToPrinter(printer)}
//               disabled={isScanning || selectedPrinter?.id === printer.id}
//             />
//           </View>
//         ))}
//       </ScrollView>

//       <View style={styles.footer}>
//         <Button
//           title="Print Receipt"
//           onPress={printReceipt}
//           disabled={!selectedPrinter}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     padding: 10,
//   },
//   printerList: {
//     flex: 1,
//     marginVertical: 10,
//   },
//   printerListContent: {
//     paddingHorizontal: 10,
//   },
//   printerItem: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     marginVertical: 5,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   printerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   printerInfo: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   footer: {
//     padding: 10,
//   },
//   noDevicesText: {
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//   }
// });

// export default BluetoothPrinter;

import React from 'react';
import { View, Button, Alert, Platform, StyleSheet } from 'react-native';
import RNPrint from 'react-native-print';

const SimplePrinter: React.FC = () => {
  
  // const printReceipt = async () => {
  //   try {
  //       console.log('Opening Print Dialog...');
        
  //       await RNPrint.print({
  //         html: `
  //              <div style="font-family: Arial, sans-serif; padding: 15px; border: 2px solid black; border-radius: 10px; width: 350px; text-align: center;">
  //                   <h2 style="margin-bottom: 10px;">TN-K3NNZ-277181</h2>
  //                   <div style="display: flex; align-items: center; justify-content: space-between;">
  //                       <p style="margin: 0; font-size: 14px; text-align: left; white-space: pre-line; flex: 1;">
  //                           Faizan Lakhani,
  //                           C-20, Block-7,
  //                           Gulshan-e-Iqbal, Karachi.
  //                       </p>
  //                       <img src="data:image/png;base64,YOUR_QR_CODE_BASE64" alt="QR Code" width="100" height="100"/>
  //                   </div>
  //               </div>
  //           `,
  //           jobName: "Receipt Print",
  //       });

  //   } catch (error) {
  //       console.error('Printing error:', error);
  //       Alert.alert('Printing Error', 'Failed to print. Ensure a printer is available.');
  //   }
  // };

  const printReceipt = async (trackingNumber:any, address:any, qrCodeBase64:any) => {
    try {
        console.log('Opening Print Dialog...');
        
        await RNPrint.print({
            html: `
                <div style="font-family: Arial, sans-serif; padding: 15px; border: 2px solid black; border-radius: 10px; width: 350px; text-align: center;">
                    <h2 style="margin-bottom: 10px;">${trackingNumber}</h2>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <p style="margin: 0; font-size: 14px; text-align: left; white-space: pre-line; flex: 1;">
                            ${address}
                        </p>
                        <img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code" width="100" height="100"/>
                    </div>
                </div>
            `,
            jobName: "Label Print",
        });

    } catch (error) {
        console.error('Printing error:', error);
        Alert.alert('Printing Error', 'Failed to print. Ensure a printer is available.');
    }
};

const trackingNumber = "TN-K3NNZ-277181";
const address = `Faizan Lakhani,
C-20, Block-7,
Gulshan-e-Iqbal, Karachi.`;

const qrCodeBase64 = "YOUR_QR_CODE_BASE64"; // Replace with actual Base64 QR code

  return (
    <View style={styles.container}>
      {/* <Button title="Print Receipt" onPress={printReceipt} /> */}
      <Button title="Print Receipt" onPress={printReceipt(trackingNumber, address, qrCodeBase64)} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default SimplePrinter;
