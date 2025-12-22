import React from 'react';
import { RefreshCcw, XCircle, CheckCircle, AlertTriangle, Clock, Package, CreditCard, FileText } from 'lucide-react';

export default function RefundCancellationPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Refund & Cancellation Policy</h1>
          </div>
          <p className="text-gray-600">ICCHHAPURTI - Your Manifestation Journey Partner</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <p className="text-gray-700 leading-relaxed">
            At ICCHHAPURTI, we are committed to your satisfaction and strive to provide quality products for your manifestation journey. Please read our refund and cancellation policy carefully to understand your rights and our procedures.
          </p>
        </div>

        {/* Order Cancellation */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Order Cancellation</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Before Shipment</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You can cancel your order before it has been shipped. To cancel your order, please contact us immediately at <a href="mailto:official@icchhapurti.com" className="text-purple-600 font-medium hover:underline">official@icchhapurti.com</a> with your order number.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-900 font-medium">Full Refund Available</p>
                    <p className="text-green-800 text-sm mt-1">If your order has not been processed or shipped, you will receive a full refund to your original payment method within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">After Shipment</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Once an order has been shipped, it cannot be cancelled. However, you may refuse delivery or return the item as per our return policy outlined below.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-900 text-sm">
                    Orders that have already been dispatched cannot be cancelled. Please refer to our returns section for instructions on how to return a shipped order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Return Policy</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Return Window</h3>
              <p className="text-gray-700 leading-relaxed">
                We accept returns within 7 days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Eligible Items for Return</h3>
              <div className="space-y-2">
                <div className="flex gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Defective or damaged products</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Wrong items delivered</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Items not matching the description</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Unused items in original packaging (within 7 days)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Non-Returnable Items</h3>
              <div className="space-y-2">
                <div className="flex gap-2 text-gray-700">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Items marked as non-returnable at the time of purchase</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Used or damaged items (damage not caused during shipping)</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Items without original packaging and tags</span>
                </div>
                <div className="flex gap-2 text-gray-700">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Personalized or customized products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">How to Initiate a Return</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Contact Us</h3>
                <p className="text-gray-700">Email us at <a href="mailto:official@icchhapurti.com" className="text-purple-600 font-medium hover:underline">official@icchhapurti.com</a> within 7 days of receiving your order with your order number, reason for return, and photos of the product (if applicable).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Approval</h3>
                <p className="text-gray-700">Our team will review your request and respond within 24-48 hours with return instructions and a return authorization number.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ship the Item</h3>
                <p className="text-gray-700">Pack the item securely in its original packaging and ship it to the address provided. Include the return authorization number on the package.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Inspection & Refund</h3>
                <p className="text-gray-700">Once we receive and inspect the returned item, we will process your refund within 5-7 business days.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-900 text-sm">
              <span className="font-medium">Important:</span> Customers are responsible for return shipping costs unless the return is due to our error (defective item, wrong item shipped, etc.). We recommend using a trackable shipping service for returns.
            </p>
          </div>
        </div>

        {/* Refund Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Refund Process</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Refund Timeline</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Once your return is received and inspected, we will send you an email notification regarding the approval or rejection of your refund. If approved, your refund will be processed and credited to your original payment method within 5-7 business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Refund Methods</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span><span className="font-medium">Credit/Debit Card:</span> 5-7 business days after approval</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span><span className="font-medium">Net Banking:</span> 5-7 business days after approval</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span><span className="font-medium">UPI/Wallets:</span> 5-7 business days after approval</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span><span className="font-medium">Cash on Delivery:</span> Bank transfer to your provided account details</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Partial Refunds</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                In certain situations, only partial refunds may be granted:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Items with obvious signs of use</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Items not in original packaging</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Items damaged during return shipping due to inadequate packaging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCcw className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Exchange Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            We currently do not offer direct exchanges. If you need a different item, please return the original item for a refund and place a new order for the item you want.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900 text-sm">
              For defective or damaged items, we will replace the product at no additional cost to you, including return shipping charges.
            </p>
          </div>
        </div>

        {/* Damaged or Defective Items */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Damaged or Defective Items</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you receive a damaged or defective item, please contact us within 24 hours of delivery at <a href="mailto:official@icchhapurti.com" className="text-purple-600 font-medium hover:underline">official@icchhapurti.com</a>.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Please provide:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Order number</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Clear photos of the damaged/defective item</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Photos of the packaging</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Description of the defect or damage</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            We will arrange for a replacement or full refund, including any return shipping costs, for items that are damaged or defective upon arrival.
          </p>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Processing Time</h2>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><span className="font-medium">Return Approval:</span> 24-48 hours after receiving your request</p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><span className="font-medium">Inspection:</span> 2-3 business days after receiving returned item</p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><span className="font-medium">Refund Processing:</span> 5-7 business days after approval</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Notes</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>Refunds are subject to inspection and approval of returned items.</p>
            </div>
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>We reserve the right to refuse returns that do not meet our policy criteria.</p>
            </div>
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>Shipping charges are non-refundable unless the return is due to our error.</p>
            </div>
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>Sale or clearance items may have different return policies as stated at the time of purchase.</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about our refund and cancellation policy or need assistance with a return, please don't hesitate to contact us.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-lg font-medium mb-2">📧 official@icchhapurti.com</p>
            <p className="text-sm opacity-90">Our customer support team will respond within 24-48 hours.</p>
          </div>
          <p className="mt-6 text-sm opacity-90">
            Thank you for choosing ICCHHAPURTI. We appreciate your trust in our products and services and are committed to ensuring your satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
}