import React from 'react';
import { Loader2, ChevronDown, Search } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

export default function InlineAddressForm({
    addressForm,
    setAddressForm,
    addressErrors,
    setAddressErrors,
    locationDropdown,
    setLocationDropdown,
    searchTerms,
    setSearchTerms,
    loadingStates,
    addressSaving,
    dropdownRefs,
    handleSelectCountryCode,
    handleSelectCountry,
    handleSelectState,
    handleSelectCity,
    handleSaveAddress,
    filteredCountryCodes,
    filteredCountries,
    filteredStates,
    filteredCities
}) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100 space-y-6 animate-slide-down">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <p className="text-gray-500 text-xs">Add your shipping details to complete checkout</p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => {
                            setAddressForm(prev => ({ ...prev, fullName: e.target.value }));
                            if (addressErrors.fullName) setAddressErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="Enter your full name"
                        className={`w-full bg-gray-50 border ${addressErrors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                    />
                    {addressErrors.fullName && <p className="text-red-500 text-[10px] mt-1">{addressErrors.fullName}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Mobile Number *</label>
                    <div className="flex gap-2">
                        {/* Country Code Dropdown */}
                        <div ref={el => { if (dropdownRefs && dropdownRefs.current) dropdownRefs.current['countryCode'] = el; }} className="relative w-28">
                            <div
                                onClick={() => setLocationDropdown(locationDropdown === 'countryCode' ? null : 'countryCode')}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 cursor-pointer flex items-center justify-between hover:border-gray-900 transition-all"
                            >
                                <span className="text-gray-900 text-sm">{addressForm.countryCode || '+91'}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                            </div>

                            {locationDropdown === 'countryCode' && (
                                <div className="absolute z-50 w-64 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                                    <div className="p-2 border-b border-gray-200">
                                        <div className="relative flex items-center bg-gray-50 rounded-lg px-2 border border-gray-200">
                                            <Search className="w-4 h-4 text-gray-400 pointer-events-none mr-2" />
                                            <input
                                                type="text"
                                                value={searchTerms.countryCode}
                                                onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                                                placeholder="Search country code..."
                                                className="w-full bg-transparent py-1.5 text-xs text-gray-900 outline-none focus:ring-0"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredCountryCodes.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-gray-500 text-center">No results found</div>
                                        ) : (
                                            filteredCountryCodes.map(c => (
                                                <div
                                                    key={c.isoCode}
                                                    onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}
                                                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-gray-900 transition-colors"
                                                >
                                                    +{c.phonecode} — {c.country}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <input
                            type="tel"
                            value={addressForm.mobileNumber}
                            onChange={(e) => {
                                setAddressForm(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '') }));
                                if (addressErrors.mobileNumber) setAddressErrors(prev => ({ ...prev, mobileNumber: '' }));
                            }}
                            placeholder="Enter mobile number"
                            className={`flex-1 bg-gray-50 border ${addressErrors.mobileNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                        />
                    </div>
                    {addressErrors.mobileNumber && <p className="text-red-500 text-[10px] mt-1">{addressErrors.mobileNumber}</p>}
                </div>

                {/* Country */}
                <SearchableDropdown
                    field="country"
                    label="Country"
                    placeholder="Select country"
                    options={filteredCountries}
                    value={addressForm.country}
                    onSelect={handleSelectCountry}
                    disabled={false}
                    isLoading={loadingStates.countries}
                    renderOption={(c) => `${c.flag || ''} ${c.country}`}
                    getOptionValue={(c) => c.isoCode}
                    openDropdown={locationDropdown}
                    setOpenDropdown={setLocationDropdown}
                    searchTerms={searchTerms}
                    setSearchTerms={setSearchTerms}
                    dropdownRefs={dropdownRefs}
                    errors={addressErrors}
                />

                {/* State */}
                <SearchableDropdown
                    field="state"
                    label="State"
                    placeholder="Select state"
                    options={filteredStates}
                    value={addressForm.state}
                    onSelect={handleSelectState}
                    disabled={!addressForm.countryIsoCode}
                    isLoading={loadingStates.states}
                    renderOption={(s) => s.name}
                    getOptionValue={(s) => s.isoCode}
                    openDropdown={locationDropdown}
                    setOpenDropdown={setLocationDropdown}
                    searchTerms={searchTerms}
                    setSearchTerms={setSearchTerms}
                    dropdownRefs={dropdownRefs}
                    errors={addressErrors}
                />

                {/* City */}
                <SearchableDropdown
                    field="city"
                    label="City"
                    placeholder="Select city"
                    options={filteredCities}
                    value={addressForm.city}
                    onSelect={handleSelectCity}
                    disabled={!addressForm.stateIsoCode}
                    isLoading={loadingStates.cities}
                    renderOption={(c) => c}
                    getOptionValue={(c) => c}
                    openDropdown={locationDropdown}
                    setOpenDropdown={setLocationDropdown}
                    searchTerms={searchTerms}
                    setSearchTerms={setSearchTerms}
                    dropdownRefs={dropdownRefs}
                    errors={addressErrors}
                />

                {/* Street */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Street Address *</label>
                    <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => {
                            setAddressForm(prev => ({ ...prev, street: e.target.value }));
                            if (addressErrors.street) setAddressErrors(prev => ({ ...prev, street: '' }));
                        }}
                        placeholder="Enter street address"
                        className={`w-full bg-gray-50 border ${addressErrors.street ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                    />
                    {addressErrors.street && <p className="text-red-500 text-[10px] mt-1">{addressErrors.street}</p>}
                </div>

                {/* Pin Code */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Pin Code *</label>
                    <input
                        type="text"
                        value={addressForm.pinCode}
                        onChange={(e) => {
                            setAddressForm(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }));
                            if (addressErrors.pinCode) setAddressErrors(prev => ({ ...prev, pinCode: '' }));
                        }}
                        placeholder="Enter 6-digit pin code"
                        maxLength="6"
                        className={`w-full bg-gray-50 border ${addressErrors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                    />
                    {addressErrors.pinCode && <p className="text-red-500 text-[10px] mt-1">{addressErrors.pinCode}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={addressSaving}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                    {addressSaving ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Saving Address...</span>
                        </>
                    ) : (
                        <span>Save Address &amp; Continue</span>
                    )}
                </button>
            </form>
        </div>
    );
}
