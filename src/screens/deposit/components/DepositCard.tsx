import CustomIcons from "@utils/imagePaths/customSvgs";
import Icons from "@utils/imagePaths/imagePaths";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface DepositCardProps {
  consignmentNumber: string;
  amount: number;
  checked: boolean;
  onPress: () => void;
}

const DepositCard: React.FC<DepositCardProps> = ({
  consignmentNumber,
  amount,
  checked,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checked]} >
         {checked && <Icons.Check/>}
        </View>
        <View>
          <Text style={styles.consignment}>{consignmentNumber}</Text>
          <Text style={styles.date}>01 JAN 25 03:12 PM</Text>
        </View>
      </View>
      <Text style={styles.amount}>Rs. {amount.toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal:25,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 15,
    alignItems:'center',
    justifyContent:'center'
  },
  checked: {
    backgroundColor: "#ED1C24",
    borderColor: "#ED1C24",
  },
  consignment: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop:2
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ED1C24",
  },
});

export default DepositCard;
