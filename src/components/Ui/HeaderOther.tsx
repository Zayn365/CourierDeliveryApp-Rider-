import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderStyle} from '@assets/css/main';
import CustomIcons from '@utils/imagePaths/customSvgs';

type Props = {
  headerName: string;
};

const headerNames: String[] = ['Home', 'Wallet', 'Shipments', 'Settings'];

const HeaderOther: React.FC<Props> = ({headerName}) => {
  const navigation = useNavigation();

  const canGoBack = headerNames.includes(headerName);

  return (
    <LinearGradient
      colors={['#ED1C24', '#ED1C24']}
      style={HeaderStyle.container}>
      {/* Back Button */}
      {!canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{padding: 10}}>
          <CustomIcons.LeftArrow color="white" />
        </TouchableOpacity>
      )}

      {/* Order Number */}
      <Text
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
        }}>
        {headerName}
      </Text>

      <View style={{width: 24, height: 24, padding: 10}} />
    </LinearGradient>
  );
};

export default HeaderOther;
