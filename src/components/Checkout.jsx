import { countires } from "../utils/items";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema as schema } from "../utils/validations";
import { useCart } from "../context/itemsContext";
import { useState } from "react";
import { useOrders } from "../context/ordersContext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function Checkout() {
  const { cartItems, getCartTotal } = useCart();
  const { addOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handlePlaceOrder = async (data) => {
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
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
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
                    {...register("email", { required: "Email is required" })}
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
                      {...register("firstName", { required: "First name is required" })}
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
                      {...register("lastName", { required: "Last name is required" })}
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
                    {...register("address", { required: "Address is required" })}
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
                      {...register("city", { required: "City is required" })}
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
                      {...register("country", { required: "Country is required" })}
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
                      {...register("state", { required: "State is required" })}
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
                      {...register("postalCode", { required: "Postal code is required" })}
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
                    {...register("phone", { required: "Phone number is required" })}
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
                      {...register("deliveryMethod", { required: "Delivery method is required" })}
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
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="bg-white p-6 rounded-lg shadow mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Credit Card Option */}
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod", { required: "Payment method is required" })}
                      className="peer sr-only"
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
                {watch("paymentMethod") === "credit_card" && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <input
                          type="text"
                          {...register("cardNumber", { required: "Card number is required" })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="•••• •••• •••• ••••"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm">
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          {...register("cardName", { required: "Name on card is required" })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm">
                            {errors.cardName.message}
                          </p>
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
                          {...register("expirationDate", { required: "Expiry date is required" })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="MM/YY"
                        />
                        {errors.expirationDate && (
                          <p className="text-red-500 text-sm">
                            {errors.expirationDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVC
                        </label>
                        <input
                          type="text"
                          {...register("cvc", { required: "CVC is required" })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="•••"
                        />
                        {errors.cvc && (
                          <p className="text-red-500 text-sm">
                            {errors.cvc.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {watch("paymentMethod") === "paypal" && (
                  <div className="mt-6 border-t pt-4">
                    <p className="text-center text-gray-600">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {watch("paymentMethod") === "digital_wallet" && (
                  <div className="mt-6 border-t pt-4">
                    <p className="text-center text-gray-600">
                      Choose your digital wallet payment method on the next step.
                    </p>
                  </div>
                )}
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
                  type="submit"
                  className={`w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-150 ease-in-out ${
                    !isValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isValid || loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <ClipLoader aria-label="Loading..." color="orangered" />
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
