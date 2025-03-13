import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../context/paymentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '../context/orderContext';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  TruckIcon,
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { processPayment, loading } = usePayment();
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

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
  }, [orderId]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const result = await processPayment(
        orderId,
        paymentMethod.id,
        'card',
        stripe
      );

      if (result) {
        navigate(`/order-confirmation`, {
          state: { orderId: orderId }
        });
      }
    } catch (error) {
      setError(error.message);
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
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => handlePaymentMethodChange('card')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <CreditCardIcon className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <div className="ml-3">
                          <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-900'}`}>
                            Credit/Debit Card
                          </span>
                          <p className="text-xs text-gray-500">Pay securely with your card</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
                          <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                        </div>
                      )}
                    </label>

                    <label className="relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <input
                        type="radio"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => handlePaymentMethodChange('bank_transfer')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <BanknotesIcon className={`w-6 h-6 ${paymentMethod === 'bank_transfer' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <div className="ml-3">
                          <span className={`text-sm font-medium ${paymentMethod === 'bank_transfer' ? 'text-indigo-600' : 'text-gray-900'}`}>
                            Bank Transfer
                          </span>
                          <p className="text-xs text-gray-500">Pay via bank transfer</p>
                        </div>
                      </div>
                      {paymentMethod === 'bank_transfer' && (
                        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
                          <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                        </div>
                      )}
                    </label>

                    <label className="relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => handlePaymentMethodChange('cash')}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <TruckIcon className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <div className="ml-3">
                          <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-indigo-600' : 'text-gray-900'}`}>
                            Cash on Delivery
                          </span>
                          <p className="text-xs text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                      {paymentMethod === 'cash' && (
                        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
                          <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                    <div className="border rounded-md p-4">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 