import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // const { cartItems, cartTotal, clearCart } = useCart();
  // const { user } = useAuth();

  const processCheckout = async () => {
    try {
      setLoading(true);

      if (!shippingAddress || !paymentMethod) {
        throw new Error('Please complete all checkout steps');
      }

      // Create order with current cart items
      // const orderData = {
      //   items: cartItems.map(item => ({
      //     product: item.product._id,
      //     quantity: item.quantity,
      //     price: item.product.new_price
      //   })),
      //   total: cartTotal,
      //   shippingAddress,
      //   paymentMethod,
      //   status: 'pending'
      // };

      // const response = await orders.create(orderData);
      
      // // Clear cart after successful order
      // clearCart();
      
      // Reset checkout
      resetCheckout();

      toast.success('Order placed successfully!');
      // return response.data.order;

    } catch (error) {
      toast.error(error.message || 'Error processing checkout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetCheckout = () => {
    setCheckoutStep(1);
    setShippingAddress(null);
    setPaymentMethod(null);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Shipping
        return !!shippingAddress;
      case 2: // Payment
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateStep(checkoutStep)) {
      setCheckoutStep(prev => prev + 1);
      return true;
    }
    toast.error('Please complete all required fields');
    return false;
  };

  const goToPreviousStep = () => {
    setCheckoutStep(prev => Math.max(1, prev - 1));
  };

  return (
    <CheckoutContext.Provider value={{
      checkoutStep,
      setCheckoutStep,
      shippingAddress,
      setShippingAddress,
      paymentMethod,
      setPaymentMethod,
      loading,
      processCheckout,
      resetCheckout,
      goToNextStep,
      goToPreviousStep,
      validateStep
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};