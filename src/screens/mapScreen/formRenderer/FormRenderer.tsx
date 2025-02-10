import React from 'react';
import OrderStart from '../forms/OrderStart';
import PickUpDetails from '../forms/PickUpDetails';
import DeliveryDetails from '../forms/DeliveryDetails';
import ProofOfDelivery from '../forms/ProofOfDelivery';
import useAuthStore from '@utils/store/authStore';
import ReturnShipment from '../forms/ReturnShipment';
import CancelShipment from '../forms/CancelShipment';
import QRCodeScannerComponent from '../components/QrCodeScanner';
type Prop = {
  currentStep: number;
  nextStep: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  shouldGet: boolean;
  currentOrder: any;
};
const FormRenderer: React.FC<Prop> = ({
  currentStep,
  nextStep,
  setCurrentStep,
  currentOrder,
}) => {
  // console.log('TCL ~ currentOrder:', currentOrder);
  const {token}: any = useAuthStore();

  switch (currentStep) {
    case 1:
      return (
        <>
          <OrderStart
            packageData={currentOrder}
            nextStep={nextStep}
            token={token}
          />
        </>
      );
    case 2:
      return (
        <PickUpDetails
          nextStep={nextStep}
          setCurrentStep={setCurrentStep}
          packageData={currentOrder}
          token={token}
        />
      );
    case 3:
      return (
        <DeliveryDetails
          token={token}
          packageData={currentOrder}
          nextStep={nextStep}
          setCurrentStep={setCurrentStep}
        />
      );
    case 4:
      return (
        <>
          <ProofOfDelivery data={currentOrder} packageData={currentOrder} />
        </>
      );
    case 55:
      return (
        <CancelShipment id={currentOrder && currentOrder?.id} token={token} />
      );
    case 66:
      return (
        <ReturnShipment
          id={currentOrder && currentOrder?.id}
          token={token}
          shipperNumber={currentOrder?.customer?.mobile}
        />
      );
    case 77:
      return (
        <QRCodeScannerComponent
          setCurrentStep={setCurrentStep}
          id={currentOrder && currentOrder?.id}
          token={token}
        />
      );
    default:
      return null;
  }
};

export default FormRenderer;
