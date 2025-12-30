import React from 'react';
import { Star } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = {
    average: 4.89,
    total: 19,
    distribution: [
      { stars: 5, count: 17 },
      { stars: 4, count: 2 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ]
  };

  const StarRating = ({ rating, size = "w-6 h-6" }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.floor(rating)
                ? 'fill-amber-500 text-amber-500'
                : star - rating < 1
                ? 'fill-amber-500 text-amber-500'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const RatingBar = ({ stars, count, total }) => {
    const percentage = (count / total) * 100;
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < stars ? 'fill-amber-500 text-amber-500' : 'fill-gray-300 text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-600 w-8 text-right text-sm">{count}</span>
      </div>
    );
  };

  return (
    <div className=" mx-auto p-8 bg-white">
      <h1 className="text-4xl font-serif text-center mb-12">Customer Reviews</h1>
      
      <div className="flex max-w-6xl flex-col lg:flex-row gap-12 mb-12">
        {/* Left Section - Overall Rating */}
        <div className="lg:w-1/3">
          <StarRating rating={reviews.average} />
          <div className="mt-3">
            <span className="text-2xl font-semibold">{reviews.average} out of 5</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <span>Based on {reviews.total} reviews</span>
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Middle Section - Rating Distribution */}
        <div className="lg:w-1/3 space-y-2">
          {reviews.distribution.map((item) => (
            <RatingBar
              key={item.stars}
              stars={item.stars}
              count={item.count}
              total={reviews.total}
            />
          ))}
        </div>

        {/* Right Section - Action Buttons */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <button className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded transition-colors">
            Write a review
          </button>
          <button className="w-full py-3 px-6 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold rounded transition-colors">
            Ask a question
          </button>
        </div>
      </div>

      {/* Customer Photos & Videos Section */}
      <div>
        <h2 className="text-xl text-gray-600 mb-4">Customer photos & videos</h2>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"
              alt="Customer photo 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=200&fit=crop"
              alt="Customer photo 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;