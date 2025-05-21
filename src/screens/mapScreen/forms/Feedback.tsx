import CustomButton from '@components/Ui/CustomButton';
import CustomInput from '@components/Ui/CustomInput';
import CustomText from '@components/Ui/CustomText';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '@utils/helper/helperFunctions';
import Icons from '@utils/imagePaths/imagePaths';
import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useAuthStore from '@utils/store/authStore';
import {errorToast} from '@components/Ui/CustomToast';

const FeedbackScreen = ({orderId}: any) => {
  const [ratingCustomer, setRatingCustomer] = useState(0);
  const [feedback, setFeedback] = useState('');
  const {user, token} = useAuthStore.getState();
  const {
    giveFeedBack,
    setCurrentStep,
    skipFeedBack,
  } = usePlaceOrder.getState();
  
  const submitFeedback = () => {
    if (ratingCustomer) {
      const params = {
        orderId: orderId,
        userId: user?.id,
        riderStars: ratingCustomer,
        feedback: feedback,
      };
      giveFeedBack(token as string, params);
      setTimeout(() => {
        setCurrentStep(1);
      }, 300); // Add slight delay to allow order state to reset
    } else {
      errorToast('Please fill all the fields');
    }
  };

  const skip = () => {
    const params = {
      orderId: orderId,
    };
    skipFeedBack(token as string, params);
    setTimeout(() => {
      setCurrentStep(1);
    }, 300); // Add slight delay to allow order state to reset
  };

  return (
    <ScrollView>
      <View style={styles.container}>

        <Icons.ThankYouGreen />
        <CustomText isBold style={styles.title}>
          Thank You
        </CustomText>
        <CustomText style={styles.subtitle}>
          Your parcel has been successfully delivered.
        </CustomText>

        <CustomText style={styles.rateText}>Rate the Customer</CustomText>

        <StarRating
          rating={ratingCustomer}
          onChange={setRatingCustomer}
          color="#FF7B00"
          starSize={40}
          enableHalfStar={false}
          style={styles.starRating}
        />

        <CustomInput
          style={styles.textInput}
          placeholder="What could we do better next time?"
          value={feedback}
          setValue={setFeedback}
          multiline={true}
          numberOfLines={4}
        />

        <View style={{width: SCREEN_WIDTH * 0.8, marginTop: 20}}>
          <CustomButton
            disabled={!ratingCustomer}
            onPress={submitFeedback}
            text="Submit Feedback"
          />
          <CustomButton
            customStyle={{marginTop: 0}}
            isWhite
            onPress={skip}
            text="Skip"
          />
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    color: '#465061',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  rateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
    color: '#465061',
  },
  starRating: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  experienceText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 10,
    color: '#465061',
  },
  textInput: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.2,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: '#EEF3FB',
  },
});

export default FeedbackScreen;