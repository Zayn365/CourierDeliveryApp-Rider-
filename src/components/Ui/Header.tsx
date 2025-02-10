import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {HeaderStyle} from '@assets/css/main';
import LinearGradient from 'react-native-linear-gradient';
import Icons from '@utils/imagePaths/imagePaths';
import {useNavigation} from '@react-navigation/native';
import useChatStore from '@utils/store/chatStore';

type Props = {};
const Header: React.FC<Props> = () => {
  const [hasNewNotification, sethasNewNotification] = useState(false);

  const {notification} = useChatStore();
  const navigation: any = useNavigation();
  const previousNotificationLength = useRef(notification?.length || 0);
  useEffect(() => {
    previousNotificationLength.current = notification?.length || 0;
  }, [notification]);

  return (
    <>
      <LinearGradient
        colors={['#ED1C24', '#ED1C24']}
        style={HeaderStyle.container}>
        {/* Logo */}
        <View style={{marginLeft: -20}}>
          <Icons.Logo width={100} height={100} />
        </View>
        {/* Notification Bell Icon */}
        <View style={HeaderStyle.availableDivider}>
          {hasNewNotification ? (
            ''
          ) : (
            <Icons.Notification
              width={30}
              height={30}
              onPress={() => {
                navigation.navigate('Notification');
              }}
            />
          )}
        </View>
      </LinearGradient>
    </>
  );
};

export default Header;
