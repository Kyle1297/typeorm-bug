export const isPickupAddress = (addressType: string): boolean => {
  return addressType === 'PICKUP' || addressType === 'PICKUP_AND_DELIVERY';
};

export const isDeliveryAddress = (addressType: string): boolean => {
  return addressType === 'DELIVERY' || addressType === 'PICKUP_AND_DELIVERY';
};
