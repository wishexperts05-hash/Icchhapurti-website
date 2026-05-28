import { memo } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AddressSection = memo(function AddressSection({
    addresses,
    addressIndex,
    pincodeChecking,
    pincodeServiceable,
    onChangeAddress,
    onAddAddress,
}) {
    
    if (!addresses || addresses.length === 0) {
        return (
            <button
                className="shrink-0 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors whitespace-nowrap"
                onClick={onAddAddress}
            >
                Add Address to Continue
            </button>
        );
    }

    const addr = addresses[addressIndex] || addresses[0];

    return (
        <div className="mt-1 mb-3 rounded-lg border border-slate-300 p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 text-sm text-gray-800 leading-snug">
                    <p>
                        <span className="text-gray-600">{"Deliver to:"} </span>
                        <span className="font-semibold">{addr?.fullName}</span>
                    </p>
                    <p className="text-xs mt-0.5">
                        {addr?.street}, {addr?.city}, {addr?.state} – {addr?.pinCode}
                    </p>
                    <p className="text-xs">
                        {addr?.country} · {"Mobile Number:"} {addr?.phoneNumber}
                    </p>
                </div>

                <button
                    onClick={onChangeAddress}
                    className="shrink-0 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors whitespace-nowrap"
                >
                    {"Change Address"}
                </button>
            </div>

            {/* Pincode Status */}
            {pincodeChecking && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 px-1">
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Checking delivery availability...
                </div>
            )}
            {!pincodeChecking && pincodeServiceable === false && (
                <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 font-medium">
                        Pincode not serviceable. Please use another pincode.
                    </p>
                </div>
            )}
            {!pincodeChecking && pincodeServiceable === true && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-xs text-green-600 font-medium">
                        Delivery available to your location.
                    </p>
                </div>
            )}
        </div>
    );
});

export default AddressSection;
