import firestore from '@react-native-firebase/firestore';

export const riderCollection = firestore().collection('riders_locations');

/**
 * Add or update rider location in Firestore
 * @param riderId - ID of the rider
 * @param latitude - Latitude of the rider's location
 * @param longitude - Longitude of the rider's location
 * @param heading - Longitude of the rider's location
 */
export const AddRiderLocation = async (
  riderId: string,
  latitude: number,
  longitude: number,
  heading: number,
) => {
  try {
    const riderDoc = await riderCollection.where('userId', '==', riderId).get();
    if (!riderDoc.empty) {
      const documentId = riderDoc.docs[0].id;
      await riderCollection.doc(documentId).update({
        lat: latitude,
        long: longitude,
        heading: heading,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Rider location updated for ID: ${riderId}`);
    } else {
      await riderCollection.add({
        userId: riderId,
        lat: latitude,
        long: longitude,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Rider location added for ID: ${riderId}`);
    }
  } catch (error) {
    console.error('Error adding or updating rider location:', error);
  }
};
