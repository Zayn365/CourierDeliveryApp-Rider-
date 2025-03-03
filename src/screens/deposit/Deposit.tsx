// // // import React from 'react';
// // // import {Text} from 'react-native';
// // // type Props = {};

// // // const Deposit = (props: Props) => {
// // //   return <Text>Deposit</Text>;
// // // };

// // // export default Deposit;

// // import React, { useState } from "react";
// // import { View, ScrollView } from "react-native";
// // import DepositCard from "./components/DepositCard";
// // import DepositTokenCard from "./components/DepositTokenCard";
// // import CustomText from "@components/Ui/CustomText";

// // const Deposit = () => {

// //     const [selected, setSelected] = useState(["TN-KHI-C-ASK-000000", "TN-KHI-T-SUL-000000", "TN-KHI-W-BOM-000000"]);
// //     const consignments = [
// //         { id: "TN-KHI-C-ASK-000000", amount: 1915 },
// //         { id: "TN-KHI-T-SUL-000000", amount: 550 },
// //         { id: "TN-KHI-S-BHD-000000", amount: 915 },
// //         { id: "TN-KHI-S-PIB-000000", amount: 550 },
// //         { id: "TN-KHI-W-BOM-000000", amount: 760 },
// //     ];

// //     const toggleSelection = (id: string) => {
// //         setSelected((prev) =>
// //             prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
// //         );
// //     };

// //     return (
// //         <View>
// //             <CustomText
// //                 style={{
// //                     color: '#000',
// //                     fontWeight: 'bold',
// //                     paddingVertical: 15,
// //                     paddingHorizontal: 24,
// //                     backgroundColor:'#FFF',
// //                     letterSpacing:2
// //                 }}>
// //                 {`TODAY`}
// //             </CustomText>    
// //             <ScrollView style={{ padding: 0 }}>

// //                 {selected.length > 0 && (
// //                     <DepositTokenCard
// //                         tokenNumber="EZP-20240201-1234"
// //                         amountDue={selected.reduce((sum, id) => sum + (consignments.find(c => c.id === id)?.amount || 0), 0)}
// //                         consignments={selected}
// //                     />
// //                 )}

// //                 {consignments.map((item) => (
// //                     <DepositCard
// //                         key={item.id}
// //                         consignmentNumber={item.id}
// //                         amount={item.amount}
// //                         checked={selected.includes(item.id)}
// //                         onPress={() => toggleSelection(item.id)}
// //                     />
// //                 ))}

// //             </ScrollView>
// //         </View>
// //     );
// // };

// // export default Deposit;

// import React, { useState } from "react";
// import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
// import DepositCard from "./components/DepositCard";
// import DepositTokenCard from "./components/DepositTokenCard";
// import CustomText from "@components/Ui/CustomText";

// const Deposit = () => {
//     const [selected, setSelected] = useState<string[]>([]);
//     const [tokens, setTokens] = useState<{ tokenNumber: string; amountDue: number; consignments: string[] }[]>([]);

//     const consignments = [
//         { id: "TN-KHI-C-ASK-000000", amount: 1915, date: "2025-01-25" },
//         { id: "TN-KHI-T-SUL-000000", amount: 550, date: "2025-01-25" },
//         { id: "TN-KHI-S-BHD-000000", amount: 915, date: "2025-01-25" },
//         { id: "TN-KHI-S-PIB-000000", amount: 550, date: "2025-01-25" },
//         { id: "TN-KHI-W-BOM-000000", amount: 760, date: "2025-01-25" },
//     ];

//     // Example Overdue Payments
//     const overdueTokens = [{ tokenNumber: "EZP-20240101-5678", amountDue: 10349 }];

//     const toggleSelection = (id: string) => {
//         setSelected((prev) =>
//             prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//         );
//     };

//     const generateToken = () => {
//         if (selected.length === 0) return;

//         const newToken = {
//             tokenNumber: `EZP-${Date.now()}`,
//             amountDue: selected.reduce(
//                 (sum, id) =>
//                     sum + (consignments.find((c) => c.id === id)?.amount || 0),
//                 0
//             ),
//             consignments: [...selected],
//         };

//         setTokens((prev) => [...prev, newToken]);
//         setSelected([]); // Clear selection after generating a token
//     };

//     return (
//         <View style={styles.container}>
//             {/* Overdue Deposits Section */}
//             {overdueTokens.length > 0 && (
//                 <View style={styles.overdueContainer}>
//                     <View>
//                         <CustomText style={styles.overdueText}>Overdue Deposits</CustomText>
//                         <CustomText style={styles.overdueAmount}>
//                             Rs. {overdueTokens[0].amountDue.toLocaleString()}
//                         </CustomText>
//                     </View>
//                     <TouchableOpacity style={styles.payNowButton}>
//                         <CustomText style={styles.payNowText}>Pay Now</CustomText>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {/* Title "TODAY" */}
//             <CustomText style={styles.todayText}>TODAY</CustomText>

//             <ScrollView style={{ flex: 1, padding: 0 }}>
//                 {/* Render Generated Tokens */}
//                 {tokens.map((token, index) => (
//                     <DepositTokenCard
//                         key={index}
//                         tokenNumber={token.tokenNumber}
//                         amountDue={token.amountDue}
//                         consignments={token.consignments}
//                     />
//                 ))}

//                 {/* Render Check Cards */}
//                 {consignments.map((item) => (
//                     <DepositCard
//                         key={item.id}
//                         consignmentNumber={item.id}
//                         amount={item.amount}
//                         checked={selected.includes(item.id)}
//                         onPress={() => toggleSelection(item.id)}
//                     />
//                 ))}
//                 {selected.length > 0 && <View style={{ height: 80, width: '100%' }} />}
//             </ScrollView>

//             {/* Floating Generate Token Bar (Only appears when at least one consignment is selected) */}
//             {selected.length > 0 && (
//                 <View style={styles.bottomContainer}>
//                     <TouchableOpacity style={styles.generateButton} onPress={generateToken}>
//                         <CustomText style={styles.generateButtonText}>Generate Token</CustomText>
//                     </TouchableOpacity>
//                     <View style={{ alignItems: 'flex-end' }}>
//                         <CustomText style={styles.overdueText}>TOTAL</CustomText>
//                         <CustomText style={styles.totalAmount}>
//                             Rs. {selected.reduce(
//                                 (sum, id) =>
//                                     sum + (consignments.find((c) => c.id === id)?.amount || 0),
//                                 0
//                             ).toLocaleString()}
//                         </CustomText>
//                     </View>
//                     {/* <CustomText style={styles.totalAmount}>
//                         TOTAL Rs.{" "}
//                         {selected.reduce(
//                             (sum, id) =>
//                                 sum + (consignments.find((c) => c.id === id)?.amount || 0),
//                             0
//                         ).toLocaleString()}
//                     </CustomText> */}
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },
//     todayText: {
//         color: "#000",
//         fontWeight: "bold",
//         paddingVertical: 15,
//         paddingHorizontal: 24,
//         backgroundColor: "#FFF",
//         letterSpacing: 2,
//         borderBottomWidth: 0.7,
//         borderBottomColor: "#ddd",
//         borderTopWidth: 0.7,
//         borderTopColor: "#ddd",
//     },
//     overdueContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#FDECEC",
//         paddingVertical: 20,
//         paddingHorizontal: 25,
//         // borderBottomWidth: 1,
//         // borderBottomColor: "#ddd",
//     },
//     overdueText: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#000",
//     },
//     overdueAmount: {
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "#ED1C24",
//     },
//     payNowButton: {
//         backgroundColor: "#ED1C24",
//         paddingHorizontal: 15,
//         paddingVertical: 8,
//         borderRadius: 20,
//     },
//     payNowText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     bottomContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#FDECEC",
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         paddingVertical: 20,
//         paddingHorizontal: 25,
//     },
//     generateButton: {
//         backgroundColor: "#ED1C24",
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 20,
//     },
//     generateButtonText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     totalAmount: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#ED1C24",
//     },
// });

// export default Deposit;

import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import DepositCard from "./components/DepositCard";
import DepositTokenCard from "./components/DepositTokenCard";
import CustomText from "@components/Ui/CustomText";
import Icons from "@utils/imagePaths/imagePaths";

const Deposit = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [tokens, setTokens] = useState<{ tokenNumber: string; amountDue: number; consignments: string[] }[]>([]);
    const [isTodayVisible, setIsTodayVisible] = useState(true); // State for today section visibility

    const consignments = [
        { id: "TN-KHI-C-ASK-000000", amount: 1915, date: "2025-01-25" },
        { id: "TN-KHI-T-SUL-000000", amount: 550, date: "2025-01-25" },
        { id: "TN-KHI-S-BHD-000000", amount: 915, date: "2025-01-25" },
        { id: "TN-KHI-S-PIB-000000", amount: 550, date: "2025-01-25" },
        { id: "TN-KHI-W-BOM-000000", amount: 760, date: "2025-01-25" },
    ];

    // Example Overdue Payments
    const overdueTokens = [{ tokenNumber: "EZP-20240101-5678", amountDue: 10349 }];

    const toggleSelection = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const generateToken = () => {
        if (selected.length === 0) return;

        const newToken = {
            tokenNumber: `EZP-${Date.now()}`,
            amountDue: selected.reduce(
                (sum, id) =>
                    sum + (consignments.find((c) => c.id === id)?.amount || 0),
                0
            ),
            consignments: [...selected],
        };

        setTokens((prev) => [...prev, newToken]);
        setSelected([]); // Clear selection after generating a token
    };

    return (
        <View style={styles.container}>
            {/* Overdue Deposits Section */}
            {overdueTokens.length > 0 && (
                <View style={styles.overdueContainer}>
                    <View>
                        <CustomText style={styles.overdueText}>Overdue Deposits</CustomText>
                        <CustomText style={styles.overdueAmount}>
                            Rs. {overdueTokens[0].amountDue.toLocaleString()}
                        </CustomText>
                    </View>
                    <TouchableOpacity style={styles.payNowButton}>
                        <CustomText style={styles.payNowText}>Pay Now</CustomText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Title "TODAY" with Chevron Icon */}
            <TouchableOpacity
                style={styles.todayHeader}
                onPress={() => setIsTodayVisible(!isTodayVisible)}
                activeOpacity={0.7}
            >
                <CustomText style={styles.todayText}>TODAY</CustomText>
                {isTodayVisible ? <Icons.Up/> : <Icons.Down/> }
            </TouchableOpacity>

            {/* Collapsible Section for Today's Consignments */}
            {isTodayVisible && (
                <ScrollView style={{ flex: 1, padding: 0 }}>
                    {/* Render Generated Tokens */}
                    {tokens.map((token, index) => (
                        <DepositTokenCard
                            key={index}
                            tokenNumber={token.tokenNumber}
                            amountDue={token.amountDue}
                            consignments={token.consignments}
                        />
                    ))}

                    {/* Render Check Cards */}
                    {consignments.map((item) => (
                        <DepositCard
                            key={item.id}
                            consignmentNumber={item.id}
                            amount={item.amount}
                            checked={selected.includes(item.id)}
                            onPress={() => toggleSelection(item.id)}
                        />
                    ))}
                    {selected.length > 0 && <View style={{ height: 80, width: '100%' }} />}
                </ScrollView>
            )}

            {/* Floating Generate Token Bar (Only appears when at least one consignment is selected) */}
            {selected.length > 0 && (
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.generateButton} onPress={generateToken}>
                        <CustomText style={styles.generateButtonText}>Generate Token</CustomText>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'flex-end' }}>
                        <CustomText style={styles.overdueText}>TOTAL</CustomText>
                        <CustomText style={styles.totalAmount}>
                            Rs. {selected.reduce(
                                (sum, id) =>
                                    sum + (consignments.find((c) => c.id === id)?.amount || 0),
                                0
                            ).toLocaleString()}
                        </CustomText>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    todayHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingLeft: 24,
        paddingRight:28,
        // paddingHorizontal: 24,
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
    overdueContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FDECEC",
        paddingVertical: 20,
        paddingHorizontal: 25,
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
});

export default Deposit;
