// import React, { useEffect, useState } from "react";
// import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import DepositCard from "./components/DepositCard";
// import DepositTokenCard from "./components/DepositTokenCard";
// import CustomText from "@components/Ui/CustomText";
// import Icons from "@utils/imagePaths/imagePaths";
// import useDepositStore from "@utils/store/depositStore";
// import useAuthStore from "@utils/store/authStore";
// import moment from "moment";

// const Deposit = () => {
//   const { token } = useAuthStore();
//   const {
//     isLoading: depositLoading,
//     todayPayments,
//     pastPayments,
//     selectedConsignments,
//     totalSelectedAmount,
//     todayTokens,
//     pastTokens,
//     fetchTodayPayments,
//     fetchPastPayments,
//     toggleSelection,
//     generateToken,
//     generateTodaysToken,
//     generatePastsToken,
//     fetchTokens,
//     payNow,
//     error,
//   } = useDepositStore();

//   const [isTodayVisible, setIsTodayVisible] = useState(true);
//   const [isOverdueDepositVisible, setIsOverdueDepositVisible] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     if (token === undefined) {
//       setAuthLoading(true);
//     } else if (token === null) {
//       Alert.alert("Error", "Authentication token is missing.");
//       setAuthLoading(false);
//     } else {
//       setAuthLoading(false);
//       fetchTodayPayments(token);
//       fetchPastPayments(token);
//       fetchTokens(token);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (error) {
//       Alert.alert("Error", error);
//     }
//   }, [error]);

//   const handleGenerateToken = async () => {
//     if (!token) {
//       Alert.alert("Error", "Authentication token is not available.");
//       return;
//     }
//     try {
//       // await generateToken(token);
//       await generateTodaysToken(token);
//       await fetchTokens(token);
//       // Reset selection after token generation
//       useDepositStore.setState({
//         selectedConsignments: [],
//         selectedOrderIds: [],
//         totalSelectedAmount: 0,
//       });
//     } catch (err) {
//       Alert.alert("Error", "Failed to generate token.");
//     }
//   };

//   const handlePayNow = async () => {
//     if (!token) {
//       Alert.alert("Error", "Authentication token is not available.");
//       return;
//     }
//     try {
//       // await payNow(token);
//       await generatePastsToken(token);
//       await fetchTokens(token);
//     } catch (err) {
//       Alert.alert("Error", "Failed to process payment.");
//     }
//   };

//   // Filter out payments that are already tokenized
//   const availableTodayPayments = todayPayments.filter((payment) =>
//     !todayTokens.some((token) =>
//       token.orderList.some((order) => order.orderId === payment.orderId)
//     )
//   );

//   console.log("Available Today Payments:", availableTodayPayments);


//   if (authLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <CustomText style={styles.loadingText}>Loading authentication...</CustomText>
//       </View>
//     );
//   }

//   console.log("Past Tokens:", pastTokens.length);
//   console.log("Today's Tokens:", todayTokens);



//   return (
//     <View style={styles.container}>

//       {/* Title "Overdue Deposits" with Chevron Icon */}
//       <TouchableOpacity
//         style={styles.todayHeader}
//         onPress={() => setIsOverdueDepositVisible(!isOverdueDepositVisible)}
//         activeOpacity={0.7}
//       >
//         <CustomText style={styles.todayText}>Overdue Deposits</CustomText>
//         {isOverdueDepositVisible ? <Icons.Up /> : <Icons.Down />}
//       </TouchableOpacity>

//       {/* Overdue Deposits Section */}

//       {isOverdueDepositVisible  && pastPayments.total > 0 &&
//         // pastTokens.length === 0 && 
//         (<View
//           style={styles.overdueOuterContainer}
//         >
//           <View style={styles.overdueContainer}>
//             <View>
//               <CustomText style={styles.overdueText}>Overdue Deposits</CustomText>
//               <CustomText style={styles.overdueAmount}>
//                 Rs. {pastPayments.total.toLocaleString()}
//               </CustomText>
//             </View>
//             {pastTokens.length === 0 &&
//               <TouchableOpacity
//                 style={styles.payNowButton}
//                 onPress={pastTokens.length === 0 ? handlePayNow : () => { Alert.alert("Token is Already Generated") }}
//                 // disabled={depositLoading || pastTokens.length > 0}
//                 disabled={depositLoading}
//               >
//                 <CustomText style={styles.payNowText}>{`Generate Token`}</CustomText>
//               </TouchableOpacity>
//             }
//           </View>
//           {
//             pastTokens.length > 0 &&
//             <CustomText style={[styles.overdueText, { paddingHorizontal: 20, paddingBottom: 20, textAlign: 'justify' }]}>
//               Token is generated, Please visit your nearest easypaisa agent and deposit the amount due.
//             </CustomText>
//           }
//         </View>
//         )
        
//       }

//       {/* Title "TODAY" with Chevron Icon */}
//       <TouchableOpacity
//         style={styles.todayHeader}
//         onPress={() => setIsTodayVisible(!isTodayVisible)}
//         activeOpacity={0.7}
//       >
//         <CustomText style={styles.todayText}>TODAY</CustomText>
//         {isTodayVisible ? <Icons.Up /> : <Icons.Down />}
//       </TouchableOpacity>

//       {/* Collapsible Section for Today's Consignments */}
//       {isTodayVisible && (
//         <ScrollView style={{ flex: 1, padding: 0 }}>
//           {/* Render Generated Tokens */}
//           {todayTokens.length > 0 &&
//             todayTokens.map((token, index) => (
//               <DepositTokenCard
//                 key={index}
//                 tokenNumber={token.token}
//                 amountDue={token.transactionAmount}
//                 consignments={token.orderList.map((order) => order.consignmentNumber)}
//                 isPast={false} // Today’s tokens
//               />
//             ))}

//           {/* Render Past Tokens */}
//           {pastTokens.length > 0 &&
//             pastTokens.map((token, index) => (
//               <DepositTokenCard
//                 key={index}
//                 tokenNumber={token.token}
//                 amountDue={token.transactionAmount}
//                 consignments={token.orderList.map((order) => order.consignmentNumber)}
//                 isPast={true} // Past tokens
//               />
//             ))}

//           {/* Render Available Check Cards */}
//           {availableTodayPayments.map((item) => (
//             <DepositCard
//               key={item.id}
//               consignmentNumber={item?.order?.consignmentNumber}
//               // consignmentNumber={item.consignmentNumber || item.orderId.toString()}
//               amount={item.amountReceivedRider}
//               checked={selectedConsignments.includes(
//                 item.consignmentNumber || item.orderId.toString()
//               )}
//               onPress={() =>
//                 toggleSelection(
//                   item.orderId,
//                   item.amountReceivedRider,
//                   item.consignmentNumber || item.orderId.toString()
//                 )
//               }
//               createdAt={item.createdAt}
//             />
//           ))}
//           {selectedConsignments.length > 0 && (
//             <View style={{ height: 80, width: "100%" }} />
//           )}
//         </ScrollView>
//       )}

//       {/* Floating Generate Token Bar */}
//       {selectedConsignments.length > 0 && (
//         <View style={styles.bottomContainer}>
//           <TouchableOpacity
//             style={styles.generateButton}
//             onPress={handleGenerateToken}
//             disabled={depositLoading}
//           >
//             <CustomText style={styles.generateButtonText}>Generate Token</CustomText>
//           </TouchableOpacity>
//           <View style={{ alignItems: "flex-end" }}>
//             <CustomText style={styles.overdueText}>TOTAL</CustomText>
//             <CustomText style={styles.totalAmount}>
//               Rs. {totalSelectedAmount.toLocaleString()}
//             </CustomText>
//           </View>
//         </View>
//       )}

//       {/* Loading Indicator */}
//       {depositLoading && (
//         <View style={styles.loadingOverlay}>
//           <CustomText style={styles.loadingText}>Loading...</CustomText>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   todayHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 15,
//     paddingLeft: 24,
//     paddingRight: 28,
//     backgroundColor: "#FFF",
//     borderBottomWidth: 0.7,
//     borderBottomColor: "#ddd",
//     borderTopWidth: 0.7,
//     borderTopColor: "#ddd",
//   },
//   todayText: {
//     color: "#000",
//     fontWeight: "bold",
//     letterSpacing: 2,
//   },
//   overdueOuterContainer: {
//     // flexDirection: "row",
//     // justifyContent: "space-between",
//     // alignItems: "center",
//     backgroundColor: "#FDECEC",
//     // paddingVertical: 20,
//     // paddingHorizontal: 25,
//   },
//   overdueContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FDECEC",
//     paddingVertical: 20,
//     paddingHorizontal: 25,
//   },
//   overdueText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   overdueAmount: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#ED1C24",
//   },
//   payNowButton: {
//     backgroundColor: "#ED1C24",
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   payNowText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   bottomContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FDECEC",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingVertical: 20,
//     paddingHorizontal: 25,
//   },
//   generateButton: {
//     backgroundColor: "#ED1C24",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   generateButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   totalAmount: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ED1C24",
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default Deposit;

import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import DepositCard from "./components/DepositCard";
import DepositTokenCard from "./components/DepositTokenCard";
import CustomText from "@components/Ui/CustomText";
import Icons from "@utils/imagePaths/imagePaths";
import useDepositStore from "@utils/store/depositStore";
import useAuthStore from "@utils/store/authStore";
import moment from "moment";

const Deposit = () => {
  const { token } = useAuthStore();
  const {
    isLoading: depositLoading,
    todayPayments,
    pastPayments,
    selectedConsignments,
    totalSelectedAmount,
    todayTokens,
    pastTokens,
    fetchTodayPayments,
    fetchPastPayments,
    toggleSelection,
    generateToken,
    generateTodaysToken,
    generatePastsToken,
    fetchTokens,
    payNow,
    error,
  } = useDepositStore();

  const [isTodayVisible, setIsTodayVisible] = useState(true);
  const [isOverdueDepositVisible, setIsOverdueDepositVisible] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  console.log(todayPayments, "todayPayments");
  

  useEffect(() => {
    if (token === undefined) {
      setAuthLoading(true);
    } else if (token === null) {
      Alert.alert("Error", "Authentication token is missing.");
      setAuthLoading(false);
    } else {
      setAuthLoading(false);
      fetchTodayPayments(token);
      fetchPastPayments(token);
      fetchTokens(token);
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleGenerateToken = async () => {
    if (!token) {
      Alert.alert("Error", "Authentication token is not available.");
      return;
    }
    try {
      await generateTodaysToken(token);
      await fetchTokens(token);
      useDepositStore.setState({
        selectedConsignments: [],
        selectedOrderIds: [],
        totalSelectedAmount: 0,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to generate token.");
    }
  };

  const handlePayNow = async () => {
    if (!token) {
      Alert.alert("Error", "Authentication token is not available.");
      return;
    }
    try {
      await generatePastsToken(token);
      await fetchTokens(token);
    } catch (err) {
      Alert.alert("Error", "Failed to process payment.");
    }
  };

  const availableTodayPayments = todayPayments.filter((payment) =>
    !todayTokens.some((token) =>
      token.orderList.some((order) => order.orderId === payment.orderId)
    )
  );

  // if (authLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <CustomText style={styles.loadingText}>Loading authentication...</CustomText>
  //     </View>
  //   );
  // }
  
  if (authLoading) {
    return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
         <ActivityIndicator size="large" color="#ED1C24" />
       </View>
     );
   }

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Title "Overdue Deposits" with Chevron Icon */}
        <TouchableOpacity
          style={styles.todayHeader}
          onPress={() => setIsOverdueDepositVisible(!isOverdueDepositVisible)}
          activeOpacity={0.7}
        >
          <CustomText style={styles.todayText}>OVER DUE DEPOSITS</CustomText>
          {isOverdueDepositVisible ? <Icons.Up /> : <Icons.Down />}
        </TouchableOpacity>

        {/* Overdue Deposits Section */}
        {isOverdueDepositVisible && pastPayments.total > 0 && (
          <View style={styles.overdueOuterContainer}>
            <View style={styles.overdueContainer}>
              <View>
                <CustomText style={styles.overdueText}>Overdue Deposits</CustomText>
                <CustomText style={styles.overdueAmount}>
                  Rs. {pastPayments.total.toLocaleString()}
                </CustomText>
              </View>
              {/* {pastTokens.length === 0 && ( */}
                <TouchableOpacity
                  style={styles.payNowButton}
                  onPress={pastTokens.length === 0 ? handlePayNow : () => Alert.alert("Token is Already Generated")}
                  disabled={depositLoading}
                >
                  <CustomText style={styles.payNowText}>{pastTokens.length === 0 ? `Generate Token` : `Token is Generated` }</CustomText>
                </TouchableOpacity>
              {/*  )} */}
            </View>
            {pastTokens.length > 0 && (
              <View style={styles.tokenContainer}>
                {/* <CustomText 
                  style={[
                    styles.overdueText, 
                    { paddingHorizontal: 20, paddingBottom: 20, textAlign: 'justify', fontWeight:'600' }
                  ]}
                >
                  Token is generated, Please visit your nearest easypaisa agent and deposit the amount due.
                </CustomText> */}
                {/* Render Past Tokens */}
                {pastTokens.map((token, index) => (
                  <DepositTokenCard
                    key={index}
                    tokenNumber={token.token}
                    amountDue={token.transactionAmount}
                    consignments={token.orderList.map((order) => order.consignmentNumber)}
                    isPast={true}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Title "TODAY" with Chevron Icon */}
        <TouchableOpacity
          style={styles.todayHeader}
          onPress={() => setIsTodayVisible(!isTodayVisible)}
          activeOpacity={0.7}
        >
          <CustomText style={styles.todayText}>TODAY</CustomText>
          {isTodayVisible ? <Icons.Up /> : <Icons.Down />}
        </TouchableOpacity>

        {/* Collapsible Section for Today's Consignments */}
        {isTodayVisible && (
          <View style={styles.todayContent}>
            {/* Render Generated Tokens */}
            {todayTokens.length > 0 &&
              todayTokens.map((token, index) => (
                <DepositTokenCard
                  key={index}
                  tokenNumber={token.token}
                  amountDue={token.transactionAmount}
                  consignments={token.orderList.map((order) => order.consignmentNumber)}
                  isPast={false}
                />
              ))}

            {/* Render Available Check Cards */}
            {availableTodayPayments.map((item) => (
              <DepositCard
                key={item.id}
                consignmentNumber={item?.order?.consignmentNumber}
                amount={item.amountReceivedRider}
                checked={selectedConsignments.includes(
                  item.consignmentNumber || item.orderId.toString()
                )}
                onPress={() =>
                  toggleSelection(
                    item.orderId,
                    item.amountReceivedRider,
                    item.consignmentNumber || item.orderId.toString()
                  )
                }
                createdAt={item.createdAt}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Generate Token Bar */}
      {selectedConsignments.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateToken}
            disabled={depositLoading}
          >
            <CustomText style={styles.generateButtonText}>Generate Token</CustomText>
          </TouchableOpacity>
          <View style={{ alignItems: "flex-end" }}>
            <CustomText style={styles.overdueText}>TOTAL</CustomText>
            <CustomText style={styles.totalAmount}>
              Rs. {totalSelectedAmount.toLocaleString()}
            </CustomText>
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {depositLoading && (
        <View style={styles.loadingOverlay}>
          <CustomText style={styles.loadingText}>Loading...</CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Ensures content isn't hidden behind floating bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingLeft: 24,
    paddingRight: 28,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.7,
    borderBottomColor: "#ddd",
    borderTopWidth: 0.7,
    borderTopColor: "#ddd",
  },
  todayText: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  overdueOuterContainer: {
    // backgroundColor: "#FDECEC",
  },
  overdueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:15,
    paddingBottom: 15,
    paddingHorizontal: 25,
    backgroundColor: "#FDECEC",
    // marginBottom: 2,
  },
  tokenContainer: {
    // paddingBottom: 20,
  },
  todayContent: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  overdueText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  overdueAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ED1C24",
  },
  payNowButton: {
    backgroundColor: "#ED1C24",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  payNowText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDECEC",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  generateButton: {
    backgroundColor: "#ED1C24",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ED1C24",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Deposit;