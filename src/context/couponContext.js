import React, { createContext, useContext, useState } from 'react';
import { coupon as couponApi } from '../services/api';
import { toast } from 'react-toastify';

const CouponContext = createContext(null);

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);

  const validateCoupon = async (code, cartTotal = 0, products = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await couponApi.validateCoupon({ 
        code,
        cartTotal,
        products: products.map(p => ({ id: p.id || p._id, price: p.price, quantity: p.quantity }))
      });
      
      if (response.data.valid) {
        const couponData = response.data.coupon;
        const discountAmount = response.data.discount;
        
        setAppliedCoupon(couponData);
        setActiveCoupon(couponData);
        setDiscount(discountAmount);
        
        // Add calculated discount to the coupon object for display
        const couponWithDiscount = {
          ...couponData,
          calculatedDiscount: discountAmount
        };
        
        toast.success('Coupon applied successfully!');
        return couponWithDiscount;
      } else {
        setAppliedCoupon(null);
        setActiveCoupon(null);
        setDiscount(0);
        setError(response.data.message || 'Invalid coupon');
        toast.error(response.data.message || 'Invalid coupon');
        return null;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error validating coupon');
      toast.error(error.response?.data?.message || 'Error validating coupon');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setActiveCoupon(null);
    setDiscount(0);
    setError(null);
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
      activeCoupon,
      loading,
      discount,
      error,
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