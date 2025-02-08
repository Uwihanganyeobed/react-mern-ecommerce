import React, { createContext, useContext, useState } from 'react';
import { coupon as couponApi } from '../services/api';
import { toast } from 'react-toastify';

const CouponContext = createContext(null);

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const validateCoupon = async (code) => {
    try {
      setLoading(true);
      const response = await couponApi.validateCoupon(code);
      
      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        setDiscount(response.data.discount);
        toast.success('Coupon applied successfully!');
        return response.data;
      } else {
        setAppliedCoupon(null);
        setDiscount(0);
        toast.error(response.data.message || 'Invalid coupon');
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error validating coupon');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    toast.success('Coupon removed');
  };

  const calculateDiscount = (amount) => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return (amount * appliedCoupon.value) / 100;
    } else {
      return appliedCoupon.value;
    }
  };

  return (
    <CouponContext.Provider value={{
      appliedCoupon,
      loading,
      discount,
      validateCoupon,
      removeCoupon,
      calculateDiscount
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
}; 