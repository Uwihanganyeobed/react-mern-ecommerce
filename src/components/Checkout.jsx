import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "../utils/validations";
import { useNavigate, Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useOrders } from "../context/orderContext";
import { countires } from "../utils/items";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Default values that match the schema structure
  const defaultValues = {
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    phone: "",
    deliveryMethod: "standard",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    expirationDate: "",
    cvc: ""
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues
  });

  // Move useEffect before any conditional returns
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form Errors:', errors);
    }
  }, [errors]);

  // The selected payment method
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // Format order data to match schema
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          company: formData.company || ''
        },
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          product: {
            _id: item.product._id,
            title: item.product.title,
            price: {
              current: item.product.price.current
            },
            stock: item.product.stock
          },
          quantity: item.quantity,
          variant: item.variant
        })),
        total: cartTotal
      };

      const order = await createOrder(orderData);
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { orderId: order._id }
      });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Error processing checkout');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const total = cartTotal;
  const shippingCost = 5.0;
  const tax = total * 0.1;
  const grandTotal = total + shippingCost + tax;

  // Redirect if not logged in or cart is empty
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" />;
  }

  return (
    <div
      className="min-h-screen bg-blue-50 flex flex-col justify-center py-12"
      id="checkout"
    >
      <div className="container mx-auto p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Contact, Shipping, Delivery, Payment */}
            <div>
              {/* Contact Information */}
              <h2 className="text-lg font-semibold mb-4">
                Contact information
              </h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="example: abcd@example.com"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              <h2 className="text-lg font-semibold mt-6 mb-4">
                Shipping information
              </h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="example: John"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="example: Doe"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="example: Company Name (optional)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register("company")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="example: 123 Main St"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="example: New York"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("country")}
                    >
                      <option value="">Select a country</option>
                      {countires.map((country) => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      placeholder="example: NY"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <input
                      type="text"
                      placeholder="example: 10001"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.postalCode ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="example: +1 (555) 123-4567"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Method */}
              <h2 className="text-lg font-semibold mt-6 mb-4">
                Delivery method
              </h2>
              <div className="bg-white p-6 rounded-lg shadow mb-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-col justify-between items-center border-2 rounded-lg p-4 w-full sm:w-1/2 sm:mr-4 mb-4 sm:mb-0 cursor-pointer hover:border-indigo-600 transition duration-150">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="standard"
                      {...register("deliveryMethod")}
                      className="form-radio h-4 w-4 text-indigo-600"
                      defaultChecked
                    />
                    <span className="ml-2 font-semibold">Standard</span>
                  </label>
                  <p className="text-gray-600 text-sm">4-10 business days</p>
                  <p className="mt-2 font-bold text-lg">$5.00</p>
                </div>

                <div className="flex flex-col justify-between items-center border-2 rounded-lg p-4 w-full sm:w-1/2 cursor-pointer hover:border-indigo-600 transition duration-150">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="express"
                      {...register("deliveryMethod")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 font-semibold">Express</span>
                  </label>
                  <p className="text-gray-600 text-sm">2-5 business days</p>
                  <p className="mt-2 font-bold text-lg">$16.00</p>
                </div>
              </div>

              {/* Payment Method */}
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="bg-white p-6 rounded-lg shadow mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Credit Card Option */}
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod")}
                      className="peer sr-only"
                      defaultChecked
                    />
                    <div className="p-4 border-2 rounded-lg hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50">
                      <div className="flex flex-col items-center">
                        <img src="/assets/icons/credit-card.svg" alt="Credit Card" className="h-12 mb-2" />
                        <h3 className="font-semibold">Credit Card</h3>
                        <div className="flex gap-2 mt-2">
                          <img src="/assets/icons/visa.svg" alt="Visa" className="h-6" />
                          <img src="/assets/icons/mastercard.svg" alt="Mastercard" className="h-6" />
                          <img src="/assets/icons/amex.svg" alt="Amex" className="h-6" />
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* PayPal Option */}
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="paypal"
                      {...register("paymentMethod")}
                      className="peer sr-only"
                    />
                    <div className="p-4 border-2 rounded-lg hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50">
                      <div className="flex flex-col items-center">
                        <img src="/assets/icons/paypal.svg" alt="PayPal" className="h-12 mb-2" />
                        <h3 className="font-semibold">PayPal</h3>
                        <p className="text-sm text-gray-500 text-center mt-2">
                          Pay with your PayPal account
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Apple/Google Pay Option */}
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="digital_wallet"
                      {...register("paymentMethod")}
                      className="peer sr-only"
                    />
                    <div className="p-4 border-2 rounded-lg hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50">
                      <div className="flex flex-col items-center">
                        <img src="/assets/icons/wallet.svg" alt="Digital Wallet" className="h-12 mb-2" />
                        <h3 className="font-semibold">Digital Wallet</h3>
                        <div className="flex gap-2 mt-2">
                          <img src="/assets/icons/apple-pay.svg" alt="Apple Pay" className="h-10" />
                          <img src="/assets/icons/google-pay.svg" alt="Google Pay" className="h-10" />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Conditional rendering based on selected payment method */}
                {paymentMethod === "credit_card" && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <input
                          type="text"
                          maxLength="16"
                          {...register("cardNumber")}
                          placeholder="1234567890123456"
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.cardNumber ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          {...register("cardName")}
                          placeholder="John Doe"
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.cardName ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm">{errors.cardName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          maxLength="5"
                          {...register("expirationDate")}
                          placeholder="MM/YY"
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.expirationDate ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.expirationDate && (
                          <p className="text-red-500 text-sm">{errors.expirationDate.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVC
                        </label>
                        <input
                          type="text"
                          maxLength="4"
                          {...register("cvc")}
                          placeholder="123"
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.cvc ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.cvc && (
                          <p className="text-red-500 text-sm">{errors.cvc.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="mt-6 border-t p-3 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <p className="text-center text-gray-700">
                      You will be redirected to PayPal to complete payment after placing order
                    </p>
                  </div>
                )}

                {paymentMethod === "digital_wallet" && (
                  <div className="mt-6 border-t p-3 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <p className="text-center text-gray-700">
                      Digital wallet payment will be processed after placing order
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex">Order summary</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Items in cart</h3>
                  <div className="max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex py-2 border-b">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img 
                            src={item.product?.thumbnail || '/placeholder.jpg'}
                            alt={item.product?.title || 'Product'}
                            className="h-full w-full object-cover object-center" 
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h4 className="text-sm">{item.product?.title || 'Product'}</h4>
                            <p className="ml-4">${((item.product?.price?.current || 0) * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.color && ` • Color: ${item.color}`}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex gap-2 flex-col">
                  <div className="flex justify-between text-lg font-medium">
                    <p>Subtotal</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-700">
                    <p>Shipping</p>
                    <p>${shippingCost.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <p>Taxes</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <div className="flex justify-between text-xl font-bold">
                    <p>Total</p>
                    <p className="text-gray-700">${grandTotal.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-150 ease-in-out ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <ClipLoader size={24} color="#ffffff" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>
                {/* Debug info - remove in production */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-4 p-2 bg-red-50 text-red-900 text-xs rounded">
                    Validation issues detected. Please check all required fields.
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}