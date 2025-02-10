import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '@components/Ui/CustomText';
import CustomInput from '@components/Ui/CustomInput';
import RadioButton from '@components/Ui/CustomRadioButton';
import {homeStyles} from '@assets/css/map';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '@components/Ui/CustomButton';
import CustomSmallButton from '@components/Ui/CustomSmallButton';
import {useNavigation} from '@react-navigation/native';
import {handleReturnOrder} from '../helperFunctions/helper';
import CustomIcons from '@utils/imagePaths/customSvgs';
import {callFunction} from '@utils/helper/helperFunctions';

interface Props {
  token: string;
  id: number;
  shipperNumber: string;
}

const ReturnShipment: React.FC<Props> = ({token, id, shipperNumber}) => {
  const navigate = useNavigation();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [selected, setSelected] = useState<string>('Shipper');
  const reasons = [
    'Recipient Unavailable',
    'Incorrect Address',
    'Refused by Recipient',
    'Other',
  ];
  const numberToCall = selected === 'Shipper' ? shipperNumber : '03312818837';
  console.log('🚀 ~ numberToCall:', numberToCall);
  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'Other') {
      setOtherReason('');
    }
  };

  const UpdateStatus = async () => {
    const reason =
      selectedReason && selectedReason.toLowerCase() === 'other'
        ? otherReason
        : selectedReason;
    await handleReturnOrder(id, reason, token);
    navigate.goBack();
  };

  return (
    <View>
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          paddingBottom: 50,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.upperStyle}>
          <CustomText isBold={true} style={homeStyles.heading}>
            Return Shipment
          </CustomText>
          <View style={styles.innerStyle}>
            <CustomText style={styles.callShipper}>Call {selected}</CustomText>
            <TouchableOpacity
              onPress={() => callFunction(numberToCall)}
              style={styles.callShipperIcon}>
              <CustomIcons.CallIcon color={'#4CD964'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={homeStyles.switchBtn}>
          <CustomSmallButton
            label="Shipper"
            isActive={selected === 'Shipper'}
            onPress={() => setSelected('Shipper')}
          />
          <CustomSmallButton
            label="Operations"
            isActive={selected === 'Operations'}
            onPress={() => setSelected('Operations')}
          />
        </View>
        <View style={styles.container}>
          {/* Content */}
          <View style={styles.content}>
            <CustomText isBold={true} style={styles.title}>
              Please provide the reason for returning the parcel.
            </CustomText>

            {/* Radio Buttons */}
            <View style={styles.radioGroup}>
              {reasons.map(reason => (
                <RadioButton
                  key={reason}
                  label={reason}
                  isSelected={selectedReason === reason}
                  onPress={() => handleReasonSelect(reason)}
                />
              ))}
            </View>

            {/* Input for "Other" */}
            <CustomInput
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter reason for return"
              value={otherReason}
              setValue={setOtherReason}
            />
          </View>
        </View>
        {/* Finish Button */}
        <CustomButton
          disabled={!selectedReason}
          //   loader={isLoading}
          onPress={UpdateStatus}
          text="Finish Delivery"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: '#EEF3FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabActive: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 10,
  },
  callShipperIcon: {
    marginBottom: 20,
    padding: 5,
  },

  callShipper: {marginBottom: 20, marginLeft: 20, color: '#76777C'},
  tabInactive: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  callText: {
    fontSize: 16,
    color: '#fff',
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
  radioGroup: {
    marginBottom: 10,
  },
  input: {
    borderRadius: 18,
    height: 100,
    paddingBottom: 50,
  },
  upperStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default ReturnShipment;
