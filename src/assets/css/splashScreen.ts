import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: height,
    padding: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: '#ED1C24',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageTop: {
    width: width,
    height: height * 0.5,
    marginBottom: -25,
  },
  curvedContainer: {
    width: '100%',
    height: height,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: '#ED1C24 !important',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // image: {
  //   width: width * 0.1,
  //   height: width * 0.1,
  //   marginTop: -30,
  // },
  textContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 37,
    // fontWeight: '700',
    color: '#505F79',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 45,
    fontFamily: 'Outfit-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#737B85',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 25,
    // fontWeight: '500',
    opacity: 0.6,
    fontFamily: 'Outfit-Regular',
  },
});
