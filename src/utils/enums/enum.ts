export const OrderStatusEnum = Object.freeze({
  PENDING: 1,
  ASSIGNED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
  RETURNED: 7,
  CANCELLED: 8,
  DISPUTED: 9,
  OUT_FOR_PICKUP: 10,
});

// Parcel Type Enum
export const ParcelTypeEnum = Object.freeze({
  PARCEL: 1,
  DOCUMENT: 2,
});

// Calculation Type Enum
export const CalculationTypeEnum = Object.freeze({
  WEIGHT_BASED: 1,
  DISTANCE_BASED: 2,
  WEIGHT_AND_DISTANCE_BASED: 4,
});

// Payment Type Enum
export const PaymentTypeEnum = Object.freeze({
  CASH: 1,
  DIGITAL_PAYMENT: 2,
  WALLET: 3,
});

// Payment From Enum
export const PaymentFromEnum = Object.freeze({
  SENDER: 1,
  CONSIGNEE: 2,
});
