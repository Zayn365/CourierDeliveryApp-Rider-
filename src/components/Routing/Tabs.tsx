import {View} from 'react-native';
import {useLinkBuilder} from '@react-navigation/native';
import {PlatformPressable} from '@react-navigation/elements';
import CustomText from '@components/Ui/CustomText';
import CustomIcon from '@utils/imagePaths/customSvgs';

export default function MyTabBar({state, descriptors, navigation}: any) {
  const {buildHref} = useLinkBuilder();

  const openIcon = (name: string, color: string) => {
    switch (name) {
      case 'Home': {
        return <CustomIcon.HomeIcon color={color} />;
      }
      case 'Wallet': {
        return <CustomIcon.WalletIcon color={color} />;
      }
      case 'Settings': {
        return <CustomIcon.SettingIcon color={color} />;
      }
      case 'Shipments': {
        return <CustomIcon.PackageIcon color={color} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            {openIcon(route.name, isFocused ? '#ED1C24' : '#465061')}
            <CustomText
              style={{
                color: isFocused ? '#ED1C24' : '#465061',
                textAlign: 'center',
              }}>
              {label}
            </CustomText>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
