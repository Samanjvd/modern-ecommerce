import { create } from 'zustand';

import type { CheckoutFormData } from '@/pages/Checkout/checkoutSchema';

export type ShippingMethod = 'normal' | 'express';

type CheckoutState = {
  shippingMethod: ShippingMethod;
  shippingData: CheckoutFormData | null;

  setShippingMethod: (method: ShippingMethod) => void;
  setShippingData: (data: CheckoutFormData) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingMethod: 'normal',
  shippingData: null,

  setShippingMethod: (method) => {
    set({ shippingMethod: method });
  },

  setShippingData: (data) => {
    set({ shippingData: data });
  },

  clearCheckout: () => {
    set({
      shippingMethod: 'normal',
      shippingData: null,
    });
  },
}));
