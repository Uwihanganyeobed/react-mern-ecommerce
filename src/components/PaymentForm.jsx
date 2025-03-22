import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '../context/orderContext';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { usePayment } from '../context/paymentContext';
import { payment } from '../services/api';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  TruckIcon,
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';

const PaymentForm = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { getOrderById } = useOrders();
  const { getStripe } = usePayment();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        toast.error('Failed to load order details');
        navigate('/order-history');
      }
    };
    fetchOrder();
  }, [orderId, getOrderById, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        try {
          setLoading(true);
          
          console.log("Stripe publishable key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? "Key exists" : "Key missing");
          
          // Create Checkout Session for card payment
          const response = await payment.createCheckoutSession(order._id);
          
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to create checkout session');
          }
          
          // Use the URL provided by Stripe directly
          if (response.data.url) {
            window.location.href = response.data.url;
            return;
          } else if (response.data.sessionId) {
            // Fallback to the old method if url is not provided
            window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
            return;
          } else {
            throw new Error('No checkout URL or session ID provided');
          }
        } catch (err) {
          console.error('Payment error:', err);
          setError(err.message || 'Payment processing failed');
          setLoading(false);
        }
      } else if (paymentMethod === 'bank_transfer') {
        // Handle bank transfer payment
        await payment.processAlternativePayment(order._id, 'bank_transfer');
        
        navigate(`/order-confirmation`, {
          state: { orderId: order._id, isNewOrder: true }
        });
      } else if (paymentMethod === 'cash') {
        // Handle cash on delivery
        await payment.processAlternativePayment(order._id, 'cash');
        
        navigate(`/order-confirmation`, {
          state: { orderId: order._id, isNewOrder: true }
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCheckout = async () => {
    try {
      setLoading(true);
      
      // Log the Stripe key (remove in production)
      console.log("Stripe key available:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? "Yes" : "No");
      
      // Use the test checkout endpoint
      const response = await payment.createTestCheckout();
      
      if (!response.data.success || !response.data.sessionId) {
        throw new Error(response.data.message || 'Failed to create test checkout session');
      }
      
      console.log("Test session created successfully:", response.data.sessionId);
      
      // Direct redirect to Stripe with the publishable key as a query parameter
      const sessionId = response.data.sessionId;
      const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        throw new Error("Stripe publishable key is not available");
      }
      
      // Redirect with the API key as a query parameter
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}?apiKey=${encodeURIComponent(publishableKey)}`;
    } catch (err) {
      console.error('Test checkout error:', err);
      setError(err.message || 'Test checkout failed');
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Payment Details */}
            <div>
              <div className="mb-4">
                <button
                  onClick={() => navigate(`/order/${orderId}`)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  Back to Order Details
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <label className="relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => handlePaymentMethodChange('card')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <CreditCardIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Credit/Debit Card</span>
                          <span className="block text-sm text-gray-500">Pay securely with your card</span>
                        </div>
                      </div>
                      <div className={`absolute inset-0 rounded-lg ring-2 ${paymentMethod === 'card' ? 'ring-indigo-500' : 'ring-transparent'}`} aria-hidden="true" />
                    </label>

                    <label className="relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => handlePaymentMethodChange('bank_transfer')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <BanknotesIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Bank Transfer</span>
                          <span className="block text-sm text-gray-500">Pay via bank transfer</span>
                        </div>
                      </div>
                      <div className={`absolute inset-0 rounded-lg ring-2 ${paymentMethod === 'bank_transfer' ? 'ring-indigo-500' : 'ring-transparent'}`} aria-hidden="true" />
                    </label>

                    <label className="relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => handlePaymentMethodChange('cash')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <TruckIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                          <span className="block text-sm text-gray-500">Pay when you receive your order</span>
                        </div>
                      </div>
                      <div className={`absolute inset-0 rounded-lg ring-2 ${paymentMethod === 'cash' ? 'ring-indigo-500' : 'ring-transparent'}`} aria-hidden="true" />
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-10 lg:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="flow-root">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{order.shippingAddress.email}</p>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Shipping Address:</p>
                        <p className="text-sm text-gray-700">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</dd>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <dt className="text-sm text-gray-600">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">Free</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</dd>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <ClipLoader color="#ffffff" size={20} />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      `Pay $${order.total.toFixed(2)}`
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleTestCheckout}
                    className="mt-4 w-full bg-green-600 py-2 px-4 text-white rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Test Checkout (Simple Product)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 