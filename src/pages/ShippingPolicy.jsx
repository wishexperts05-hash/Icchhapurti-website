import React from 'react';
import { Package, Clock, MapPin, Shield, AlertCircle, Globe, Truck, FileText } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen 
">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-[#D8891E]" />
            <h1 className="text-3xl font-bold text-gray-900">Shipping Policy</h1>
          </div>
          <p className="text-gray-600">ICCHHAPURTI - Your Manifestation Journey Partner</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <p className="text-gray-700 leading-relaxed">
            Thank you for choosing ICCHHAPURTI for your manifestation journey. We aim to provide you a seamless and fulfilling shopping experience including efficient and reliable shipping. Please review our shipping policy to understand how we can improve our services for your orders.
          </p>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Processing Time</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Orders are typically processed within 3-5 business days. During special occasions or special promotions processing time may vary but we strive to dispatch your order as quickly as possible.
          </p>
          <div className="bg-purple-50 border border-[#D8891E] rounded-lg p-4">
            <p className="text-[#e89c33]">
              <span className="font-medium">Business Days:</span> Monday to Friday. Does not include Saturday, Sunday or National Holidays.
            </p>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Shipping Methods</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            We offer various shipping methods to cater to your preferences and needs. The available shipping options will be displayed during the checkout process. Our standard shipping methods include:
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">1. Standard Shipping</h3>
              <p className="text-gray-700">Estimated delivery within 5-8 business days</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">2. Express Shipping</h3>
              <p className="text-gray-700">Faster delivery with an estimated time frame of 3-5 business days</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 text-sm">
                  Please note that these delivery times are estimated and may vary based on your location, weather conditions, and other unforeseen circumstances. Orders may arrive earlier or later than the estimated dates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Rates</h2>
          <p className="text-gray-700 leading-relaxed">
            Shipping rates are calculated based on the weight of your order and selected shipping method. You can view the shipping costs during the checkout process before finalizing your purchase.
          </p>
        </div>

        {/* International Shipping */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">International Shipping</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            We currently offer shipping within select countries. International shipping rates and delivery times may vary.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm">
              <span className="font-medium">Important:</span> Customs duties and taxes may be applicable upon receipt of the order and are the responsibility of the recipient.
            </p>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Order Tracking</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Once your order is shipped, you will receive a confirmation email with tracking information. This allows you to track the status and location of your package.
          </p>
        </div>

        {/* Shipping Delays */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Shipping Delays</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            While we strive to meet our delivery estimates, please be aware that delays may occur due to factors beyond our control such as customs clearance procedures, weather conditions or other unforeseen circumstances. We appreciate your understanding in such situations.
          </p>
        </div>

        {/* Lost or Stolen Packages */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Lost or Stolen Packages</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            In the rare event that your package is lost or stolen during transit, please contact our customer support team at <a href="mailto:official@icchhapurti.com" className="text-[#D8891E] font-medium hover:underline">official@icchhapurti.com</a> for assistance. We will work with the shipping carrier to resolve the issue and ensure you receive your order.
          </p>
        </div>

        {/* Courier Partners */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Courier Partners and Third-Party Delivery</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              We use trusted third-party courier partners to deliver packages.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">What ICCHHAPURTI Does:</h3>
              <p>We package your order, choose an appropriate courier, and hand the shipment to that courier.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">What Courier Partners Do:</h3>
              <p>Pick up, transport, attempt delivery, update tracking, and provide Proof of Delivery (POD). Couriers are independent third parties and operate under their own policies.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Tracking and POD:</h3>
              <p>We rely on courier tracking updates and the POD recorded by the courier (signature, name, date/time) as primary evidence of delivery. If the courier's POD shows delivery to the address (or to someone at the address) and includes a signature/name, that will be treated as proof of delivery for claims and disputes.</p>
              <p className="mt-2">If a courier's records conflict with a customer's claim, we will open an investigation with the courier.</p>
            </div>
          </div>
        </div>

        {/* Delivery Attempts */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Delivery Attempts and Customer Responsibility</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Please provide a full, accurate delivery address and a phone number where someone can be reached during normal delivery hours.
            </p>

            <p className="text-gray-700 leading-relaxed">
              If the courier cannot deliver because no one is available, they will usually make multiple attempts or leave a delivery notice, depending on their policy.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-3">Reshipment Costs Apply If:</h3>
              <ul className="space-y-2 text-red-800">
                <li className="flex gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Wrong or incomplete address provided by the customer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Refusal to accept the package by the recipient</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Repeated unavailability of the recipient</span>
                </li>
              </ul>
              <p className="mt-3 text-red-800 text-sm">Reshipment costs will be charged to the customer in these cases.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <span className="font-medium">Tip:</span> If you expect a delivery but will be unavailable, consider providing an alternate delivery address (workplace, neighbor) or authorising someone to receive the parcel on your behalf. If someone else at the delivery address signs for the package, the POD will show this as delivered.
              </p>
            </div>
          </div>
        </div>

        {/* Damaged or Tampered Packages */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-[#D8891E]" />
            <h2 className="text-2xl font-semibold text-gray-900">Damaged or Tampered Packages</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4 font-medium">
            Inspect the package at the time of delivery. If the outer package is damaged or appears tampered with:
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex gap-2 text-gray-700">
              <span className="text-[#D8891E] mt-1 font-bold">1.</span>
              <span>Refuse delivery where practicable and note the reason with the delivery agent; OR</span>
            </div>
            <div className="flex gap-2 text-gray-700">
              <span className="text-[#D8891E] mt-1 font-bold">2.</span>
              <span>If you accept delivery, take clear photos of the outer packaging and the product immediately and notify us at <a href="mailto:official@icchhapurti.com" className="text-[#D8891E] font-medium hover:underline">official@icchhapurti.com</a> within 24 hours of delivery.</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            For damaged items we will coordinate with the courier and either repair, replace, or refund the item depending on the situation and investigation outcome.
          </p>
        </div>

        {/* Report Timelines */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Report Timelines</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Damaged on Arrival</h3>
              <p className="text-gray-700">Report within 24 hours of delivery and include photos of outer packaging and the product.</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Missing Items (Short-Shipment) or Non-Delivery</h3>
              <p className="text-gray-700">Report within 7 days of the expected delivery date.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-900 text-sm">
              Claims reported after these timelines may still be considered but cannot be guaranteed.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#9a7035] to-[#916a32] rounded-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions or concerns regarding your order or our shipping policy, please contact our customer support team.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-lg text-black font-medium">📧 official@icchhapurti.com</p>
          </div>
          <p className="mt-6 text-sm opacity-90">
            Thank you for choosing ICCHHAPURTI. We appreciate your trust in our products and services.
          </p>
        </div>
      </div>
    </div>
  );
}