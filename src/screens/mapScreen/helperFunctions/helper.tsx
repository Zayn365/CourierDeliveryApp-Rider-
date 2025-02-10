import useAuthStore from '@utils/store/authStore';
import usePlaceOrder from '@utils/store/placeOrderStore';

export const handleCancelOrder = async (
  orderId: number,
  reason: string,
  token: string,
): Promise<void> => {
  const {cancelOrder} = usePlaceOrder.getState();
  try {
    await cancelOrder(orderId, reason, token);
  } catch (error: any) {
    console.error('Error Cancelling Order:', error);
  }
};

export const handleReturnOrder = async (
  orderId: number,
  reason: string,
  token: string,
): Promise<void> => {
  const {returnOrder} = usePlaceOrder.getState();
  try {
    await returnOrder(orderId, reason, token);
  } catch (error: any) {
    console.error('Error Cancelling Order:', error);
  }
};
export const paymentReceived = async (
  orderId: number,
  amount: number,
  token: string,
): Promise<void> => {
  const {user}: any = useAuthStore.getState();

  const {paymentReceived, getUserOrders} = usePlaceOrder.getState();
  try {
    await paymentReceived(orderId, amount, token);
    await getUserOrders(token, user.id);
  } catch (error: any) {
    console.error('Error paymentReceived:', error);
  }
};
export const handleUpdateStatus = async (
  orderId: number,
  status: number,
  token: string,
): Promise<void> => {
  const {updateStatus} = usePlaceOrder.getState();
  try {
    await updateStatus(orderId, status, token);
  } catch (error: any) {
    console.error('Error Updating Status:', error);
  }
};

export const handleUpdateQRCode = async (
  orderId: number,
  qrCode: string,
  token: string,
): Promise<void> => {
  const {user}: any = useAuthStore.getState();
  const {updateQRCode, getUserOrders} = usePlaceOrder.getState();

  try {
    await updateQRCode(orderId, qrCode, token);
    await getUserOrders(token, user.id);
  } catch (error: any) {
    console.error('Error Updating QR Code:', error);
  }
};
