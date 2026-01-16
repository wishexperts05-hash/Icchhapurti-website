import React from 'react';
import { RefreshCcw, XCircle, CheckCircle, AlertTriangle, Clock, Package, CreditCard, FileText } from 'lucide-react';

export default function RefundCancellationPolicy() {
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-8 h-8 text-[#D8891E]" />
            <h1 className="text-3xl font-bold text-gray-900">Refund & Cancellation Policy</h1>
          </div>
          <p className="text-gray-600">ICCHHAPURTI - Your Manifestation Journey Partner</p>
        </div>
      </div>

      {/* Content */}
      {/* Important Note About Returns & Refunds */}
      <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-sm p-8 mb-6 border border-amber-200">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Important Note About Returns & Refunds
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Each  <b>Manifestation Pen</b> is prepared with focused intention and energy <b>specifically for the individual</b>.
          </p>

          <p>
            Once a pen is charged, it becomes <b>energetically aligned to one person only</b>.
            Because of this personal energetic connection, the pen <b>cannot be reused, reassigned, or transferred to someone else</b>.

          </p>

          <p>
            Once a pen is charged, it becomes energetically aligned to one person only.
            Because of this personal energetic connection, the pen cannot be reused, reassigned, or transferred to someone else.

          </p>
          <p>
            This is not a mass-produced item.
            It is a <b>personal manifestation tool</b>, created with care, time, and intention exclusively for you.


          </p>
          <p>
            This is not a mass-produced item.
            It is a personal manifestation tool, created with care, time, and intention exclusively for you.



          </p>
          <p>
            We kindly ask you to place your order <b> only when you feel fully aligned and certain</b>, as this process is final



          </p>
        </div>

        {/* Why Non-Returnable */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            Why Our Pens Are Non-Returnable
          </h3>
          <p className="text-amber-900 leading-relaxed">
            Manifestation works through <b>intention, belief, and personal energy</b>.
            Once a pen has been charged for you, its purpose is fulfilled for <b>your journey alone</b>

          </p>
          <p className="text-amber-900 mt-3">
            Returning it would mean breaking that energetic bond — something we do not practice or support.
            Thank you for honoring the process, the energy, and the intention behind each creation

          </p>
        </div>

        {/* Final Acknowledgement */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Final Acknowledgement
          </h3>

          <p>By placing an order, you acknowledge and accept that</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#D8891E] mt-1">•</span>
              <span>Each pen is charged <b>exclusively for you</b></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#D8891E] mt-1">•</span>
              <span>The product is <b>non-returnable and non-refundable</b></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#D8891E] mt-1">•</span>
              <span>This policy exists to protect the <b>integrity of the manifestation process</b></span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}