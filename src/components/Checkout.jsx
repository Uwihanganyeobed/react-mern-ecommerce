import { countires } from "../utils/items";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema as schema } from "../utils/validations";
import { useCart } from "../context/itemsContext";
import { useState } from "react";
import { useOrders } from "../context/ordersContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, getCartTotal } = useCart();
  const { addOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate payment
  
    const order = {
      id: `#${Math.floor(Math.random() * 1000000)}`,
      paymentDate: new Date().toLocaleString(),
      items: cartItems,
    };
  
    addOrder(order);
    setLoading(false);
    navigate("/order"); // Redirects user to order page
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Handle the form submission, e.g., send data to API
  };

  const total = getCartTotal();
  const shippingCost = 5.0; // Example shipping cost
  const tax = total * 0.1; // Example tax rate
  const grandTotal = total + shippingCost + tax;

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
                      placeholder="example: obed"
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
                      placeholder="example: Vragas"
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
                    placeholder="example: google (optional)"
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
                    placeholder="example: KN212st"
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
                      placeholder="example: Kigali"
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
                      placeholder="example: 1234"
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
                    placeholder="example: +2507800000"
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
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <div className="bg-white p-6 rounded-lg shadow flex flex-row items-center justify-evenly mb-5">
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod")}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2">Credit card</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      {...register("paymentMethod")}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2">PayPal</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="etransfer"
                      {...register("paymentMethod")}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2">eTransfer</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700 italic">
                    Card number
                  </label>
                  <input
                    type="text"
                    placeholder="example: 34388--900-00"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-lg italic font-medium text-gray-700">
                    Name on card
                  </label>
                  <input
                    type="text"
                    placeholder="example: cardName"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.cardName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register("cardName")}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm">
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-lg italic font-medium text-gray-700">
                      Expiration date (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.expirationDate
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("expirationDate")}
                    />
                    {errors.expirationDate && (
                      <p className="text-red-500 text-sm">
                        {errors.expirationDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg italic font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.cvc ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      {...register("cvc")}
                    />
                    {errors.cvc && (
                      <p className="text-red-500 text-sm">
                        {errors.cvc.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex">Order summary</h2>
              <div className="bg-white p-6 rounded-lg shadow">
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
                  onClick={handlePlaceOrder}
                  type="button"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
