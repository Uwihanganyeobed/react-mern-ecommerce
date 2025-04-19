import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "../utils/validations";
import { useNavigate, Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useOrders } from "../context/orderContext";
import { toast } from "react-hot-toast";
import CountrySelector from './CountrySelector';
import { useCoupon } from '../context/couponContext';
import CouponForm from './CouponForm';

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { discount, activeCoupon, appliedCoupon } = useCoupon();

  // Default values that match the schema structure
  const defaultValues = {
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    phone: ""
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const orderData = {
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country
        },
        coupon: appliedCoupon ? appliedCoupon.code : null,
        discount: discount
      };

      const order = await createOrder(orderData);
      
      if (order) {
        navigate(`/order/${order._id}`, { 
          state: { isNewOrder: true }
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            {/* Left side - Contact, Shipping */}
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
                    <CountrySelector
                      value={watch('country')}
                      onChange={(value) => setValue('country', value, { shouldValidate: true })}
                      error={errors.country?.message}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State/Province
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
            </div>

            {/* Right side - Order Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
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

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <CouponForm 
                    cartTotal={cartTotal} 
                    products={cartItems.map(item => ({
                      id: item.product._id,
                      price: item.product.price.current,
                      quantity: item.quantity
                    }))}
                    onApply={(coupon) => {
                      // You can add additional logic here if needed
                    }}
                  />
                  
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                    <p>Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-base font-medium text-green-600 mt-2">
                      <p>Discount</p>
                      <p>-${discount.toFixed(2)}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                    <p>Total</p>
                    <p>${(cartTotal - discount).toFixed(2)}</p>
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
                      <span className="ml-2">Place Order</span>
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