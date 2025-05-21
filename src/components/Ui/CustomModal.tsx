// // import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
// // import React from 'react'

// // const CustomModal = ({ title, visible, onYesPress, onNoPress, onClosePress }: any) => {
// //     return (
// //         <Modal
// //             animationType="fade"
// //             transparent={true}
// //             visible={visible}
// //             onRequestClose={onClosePress}
// //         >
// //             <View style={styles.modalContainer}>
// //                 <Text>{title}</Text>
// //                 <View style={styles.buttonContainer}>
// //                     <TouchableOpacity onPress={onNoPress}>
// //                         <Text>No</Text>
// //                     </TouchableOpacity>
// //                     <TouchableOpacity onPress={onYesPress}>
// //                         <Text>Yes</Text>
// //                     </TouchableOpacity>
// //                 </View>

// //             </View>
// //         </Modal>
// //     )
// // }

// // export default CustomModal

// // const styles = StyleSheet.create({
// //     modalContainer: {
// //         borderRadius: 12,
// //         borderWidth: 1,
// //         borderColor: 'gray',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         backgroundColor:'white',
// //     },
// //     buttonContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between'
// //     },
// //     button: {
// //         borderRadius: 12,
// //         borderWidth: 1,
// //         borderColor: 'gray',
// //     },
// //     yesButton: {
// //         backgroundColor: 'lightGray'
// //     },
// //     noButton: {
// //         backgroundColor: 'red'
// //     },
// // })

// import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
// import React from 'react';

// interface CustomModalProps {
//   title: string;
//   visible: boolean;
//   onYesPress: () => void;
//   onNoPress: () => void;
//   onClosePress: () => void;
// }

// const CustomModal = ({ title, visible, onYesPress, onNoPress, onClosePress }: CustomModalProps) => {
//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClosePress}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.title}>{title}</Text>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[styles.button, styles.noButton]}
//               onPress={onNoPress}
//             >
//               <Text style={styles.buttonText}>No</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.button, styles.yesButton]}
//               onPress={onYesPress}
//             >
//               <Text style={styles.buttonText}>Yes</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default CustomModal;

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     gap: 10,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   yesButton: {
//     backgroundColor: '#4CAF50', // Green for Yes
//   },
//   noButton: {
//     backgroundColor: '#F44336', // Red for No
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

interface CustomModalProps {
  title: string;
  visible: boolean;
  onYesPress: () => void;
  onNoPress: () => void;
  onClosePress: () => void;
}

const CustomModal = ({ title, visible, onYesPress, onNoPress, onClosePress }: CustomModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClosePress}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>
          <View style={styles.questionMarkContainer}>
            <Text style={styles.questionMark}>?</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={onYesPress}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={onNoPress}
            >
              <Text style={[styles.buttonText,{color:'black'}]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '75%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  questionMarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // backgroundColor: '#2196F3', // Blue background for the circle
    backgroundColor: '#F44336', // Red for No
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    borderWidth: 6,
    borderColor: 'white',
  },
  questionMark: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',

  },
  buttonContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 100,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  yesButton: {
    // backgroundColor: '#4CAF50', // Green for Yes
    backgroundColor: '#F44336', // Red for No
  },
  noButton: {
    backgroundColor: '#EAEAEA', // Red for No
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});