import React, { useState } from 'react';
import { useCoupon } from '../context/couponContext';
import { ClipLoader } from 'react-spinners';

const CouponForm = ({ cartTotal, products, onApply }) => {
  const [code, setCode] = useState('');
  const { validateCoupon, removeCoupon, activeCoupon, loading, error } = useCoupon();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    const result = await validateCoupon(code, cartTotal, products);
    if (result && onApply) {
      onApply(result);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    if (onApply) {
      onApply(null);
    }
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Apply Coupon</h3>
      
      {activeCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-800">
                Coupon applied: <span className="font-bold">{activeCoupon.code}</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                {activeCoupon.type === 'percentage' 
                  ? `${activeCoupon.value}% off` 
                  : `$${activeCoupon.value.toFixed(2)} off`}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex space-x-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (loading || !code.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <ClipLoader size={16} color="#ffffff" />
            ) : (
              'Apply'
            )}
          </button>
        </form>
      )}
      
      {error && !activeCoupon && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CouponForm; 