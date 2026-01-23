import React from 'react';
import { Tag } from 'lucide-react';

export default function OfferDisplay({ offers = [] }) {
  // Default sample data if no offers provided
  const defaultOffers = [
    {
      code: 'SADHNA10',
      discount: '₹79.80',
      description: 'Enter a Coupon'
    },
    {
      code: 'SAVE20',
      discount: '₹150.00',
      description: 'Special Discount'
    },
    {
      code: 'FIRST50',
      discount: '₹200.00',
      description: 'First Order Offer'
    }
  ];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-3">
      {displayOffers.map((offer, index) => (
        <div
          key={index}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Left section with icon and offer details */}
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-full p-2">
              <Tag className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">
                  {offer.code}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  Save {offer.discount}
                </span>
              </div>
              <span className="text-orange-500 text-sm mt-1">
                {offer.description} &gt;
              </span>
            </div>
          </div>

          {/* Right section with Apply button */}
          <button className="bg-white text-orange-500 font-semibold px-6 py-2 rounded border-2 border-orange-500 hover:bg-orange-50 transition-colors">
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}