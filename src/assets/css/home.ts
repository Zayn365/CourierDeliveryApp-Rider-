import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const circleSize = width * 0.5;

export const home = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerNoOrder: {flex: 1, justifyContent: 'center'},
  customNoOrder: {textAlign: 'center', fontSize: 16, color: '#0000006e'},
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fdf2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    flex: 1,
    marginHorizontal: 5,
  },
  bookingText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 28,
    // fontWeight: '700',
    color: '#000',
  },
  statLabelSmall: {
    fontSize: 13,
    color: '#666',
    // marginTop: 5,
    marginHorizontal: 15,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  radarCircleOuter: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCircleMiddle: {
    width: circleSize * 0.7,
    height: circleSize * 0.7,
    borderRadius: (circleSize * 0.7) / 2,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCircleInner: {
    width: circleSize * 0.4,
    height: circleSize * 0.4,
    borderRadius: (circleSize * 0.4) / 2,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    // fontWeight: '500',
    color: '#333',
  },
});
