// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// interface DepositTokenCardProps {
//     tokenNumber: string;
//     amountDue: number;
//     consignments: string[];
// }

// const DepositTokenCard: React.FC<DepositTokenCardProps> = ({
//     tokenNumber,
//     amountDue,
//     consignments,
// }) => {
//     return (
//         <View style={styles.container}>
//             <View style={styles.innerContainer}>
//                 <View style={styles.header}>
//                     <Text style={styles.label}>EASYPAISA TOKEN NUMBER</Text>
//                     <Text style={styles.label}>AMOUNT DUE</Text>
//                 </View>
//                 <View style={styles.content}>
//                     <Text style={styles.token}>{tokenNumber}</Text>
//                     <Text style={styles.amount}>Rs. {amountDue.toLocaleString()}</Text>
//                 </View>
//                 <Text style={styles.consigmentLabel}>CONSIGNMENT#</Text>
//                 {consignments.map((item, index) => (
//                     <Text key={index} style={styles.consigment}>
//                         {item}
//                     </Text>
//                 ))}
//             </View>

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#fdf2f2',
//         padding: 20,
//         // borderRadius: 10,
//         // marginBottom: 10,
//         marginBottom:1
//     },
//     innerContainer: {
//         backgroundColor: "#FFF",
//         padding: 20,
//         borderRadius: 20,
//         // marginBottom: 10,
//         shadowColor: "red",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.18,
//         shadowRadius: 1.00,
//         elevation: 1,
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//     },
//     label: {
//         fontSize: 12,
//         // fontWeight: "bold",
//         color: "#A2A2A2",
//     },
//     content: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginVertical: 8,
//     },
//     token: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#000",
//     },
//     amount: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#ED1C24",
//     },
//     consigmentLabel: {
//         fontSize: 12,
//         // fontWeight: "bold",
//         color: "#A2A2A2",
//         marginBottom:5
//     },
//     consigment: {
//         fontSize: 14,
//         color: "#465061",
//         marginTop: 0,
//         fontWeight: "500",

//     },
// });

// export default DepositTokenCard;

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DepositTokenCardProps {
  tokenNumber: string;
  amountDue: number;
  consignments: string[];
  isPast?: boolean; // New prop to differentiate past tokens
}

const DepositTokenCard: React.FC<DepositTokenCardProps> = ({
  tokenNumber,
  amountDue,
  consignments,
  isPast = false,
}) => {
  return (
    <View style={[styles.container, isPast && styles.pastContainer]}>
      <View style={[styles.innerContainer, 
        // isPast && {borderWidth:1, borderColor:"#ED1C24"}
        ]}>
        <View style={styles.header}>
          <Text style={styles.label}>EASYPAISA TOKEN NUMBER</Text>
          <Text style={styles.label}>AMOUNT DUE</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.token}>{tokenNumber}</Text>
          <Text style={styles.amount}>Rs. {amountDue.toLocaleString()}</Text>
        </View>
        <Text style={styles.consigmentLabel}>CONSIGNMENT#</Text>
        {consignments.map((item, index) => (
          <Text key={index} style={styles.consigment}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdf2f2",
    padding: 20,
    marginBottom: 1,
  },
  pastContainer: {
    backgroundColor: "rgba(237, 28, 36, 0.4)", // Red background for past tokens
    // backgroundColor: "#fdf2f2",
  },
  innerContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#A2A2A2",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  token: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ED1C24",
  },
  consigmentLabel: {
    fontSize: 12,
    color: "#A2A2A2",
    marginBottom: 5,
  },
  consigment: {
    fontSize: 14,
    color: "#465061",
    marginTop: 0,
    fontWeight: "500",
  },
});

export default DepositTokenCard;