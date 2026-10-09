import { create } from 'zustand';

import type { CheckoutFormData } from '@/pages/Checkout/checkoutSchema';

export type ShippingMethod = 'normal' | 'express';

type CheckoutState = {
  shippingMethod: ShippingMethod;
  shippingData: CheckoutFormData | null;
  orderId: number | null;

  setShippingMethod: (method: ShippingMethod) => void;
  setShippingData: (data: CheckoutFormData) => void;
  setOrderId: (id: number) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingMethod: 'normal',
  shippingData: null,
  orderId: null,

  setShippingMethod: (method) => {
    set({ shippingMethod: method });
  },

  setShippingData: (data) => {
    set({ shippingData: data });
  },

  setOrderId: (orderId) => {
    set({ orderId });
  },

  clearCheckout: () => {
    set({
      shippingMethod: 'normal',
      shippingData: null,
      orderId: null,
    });
  },
}));
