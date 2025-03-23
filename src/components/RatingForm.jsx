import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { product as productApi } from '../services/api';
import { useAuth } from '../context/authContext';

const RatingForm = ({ productId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const { isLoggedIn,user } = useAuth();

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!isLoggedIn || !productId) return;
      
      try {
        const response = await productApi.getProductRatings(productId);
        const ratings = response.data.ratings;
        
        // Find the current user's rating if it exists
        const userRating = ratings.find(r => r.user._id === user.id);
        if (userRating) {
          setRating(userRating.rating);
          setReview(userRating.review);
          setUserRating(userRating);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };
    
    fetchUserRating();
  }, [productId, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Please log in to rate this product');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setLoading(true);
      const response = await productApi.rateProduct(productId, { rating, review });
      
      toast.success('Thank you for your rating!');
      
      if (onRatingSubmit) {
        onRatingSubmit(response.data);
      }
      
      setUserRating({
        rating,
        review,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">Please log in to rate this product</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {userRating ? 'Update Your Rating' : 'Rate This Product'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Star Rating - Enhanced */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:mr-4">
              Your Rating
            </label>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none transform transition-transform hover:scale-110"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {(hoverRating || rating) >= star ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-8 w-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500 min-w-[80px]">
                {rating > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                ) : (
                  'Select a rating'
                )}
              </span>
            </div>
          </div>
          
          {/* Review Text - Enhanced */}
          <div className="mb-4">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <textarea
                id="review"
                rows="3"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Share your experience with this product..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {review.length}/500
              </div>
            </div>
          </div>
          
          {/* Submit Button - Enhanced */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={16} className="mr-2" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {userRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm; 