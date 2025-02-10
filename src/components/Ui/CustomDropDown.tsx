import {customDropDown} from '@assets/css/main';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

type Items = {
  data: any[];
  value: string | number;
  setValue?: (value: string | undefined) => void;
};

const dropdownIconSvg = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10l5 5 5-5" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;
const DropdownComponent: React.FC<Items> = ({data, value, setValue}) => {
  //   const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={customDropDown.container}>
      <Dropdown
        style={[customDropDown.dropdown, isFocus && {borderColor: '#ED1C24'}]}
        placeholderStyle={customDropDown.placeholderStyle}
        selectedTextStyle={customDropDown.selectedTextStyle}
        inputSearchStyle={customDropDown.inputSearchStyle}
        iconStyle={customDropDown.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select City' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: any) => {
          setValue?.(item.value);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <>
        //     <SvgXml xml={dropdownIconSvg} />
        //   </>
        // )}
      />
    </View>
  );
};

export default DropdownComponent;
