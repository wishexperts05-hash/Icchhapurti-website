import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SearchableDropdown = ({
    field, label, placeholder, options, value,
    onSelect, disabled, renderOption, getOptionValue, isLoading,
    openDropdown, setOpenDropdown, searchTerms, setSearchTerms, dropdownRefs, errors
}) => (
    <div ref={el => { if (dropdownRefs && dropdownRefs.current) dropdownRefs.current[field] = el; }} className="relative">
        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">{label} *</label>
        <div className={disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
            <div
                onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
                className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 cursor-pointer flex items-center justify-between hover:border-gray-900 focus:outline-none transition-all ${errors && errors[field] ? 'ring-2 ring-red-500' : ''}`}
            >
                <span className={value ? 'text-gray-900 text-sm' : 'text-gray-400 text-sm'}>
                    {isLoading ? 'Loading...' : (value || placeholder)}
                </span>
                {isLoading
                    ? <div className="w-4 h-4 border-2 border-gray-400/40 border-t-gray-600 rounded-full animate-spin" />
                    : <ChevronDown className="w-4 h-4 text-gray-500" />
                }
            </div>

            {openDropdown === field && !disabled && !isLoading && (
                <div
                    className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-hidden"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative flex items-center bg-gray-50 rounded-lg px-2 border border-gray-200">
                            <Search className="w-4 h-4 text-gray-400 pointer-events-none mr-2" />
                            <input
                                type="text"
                                value={searchTerms[field] || ''}
                                onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="w-full bg-transparent py-1.5 text-xs text-gray-900 outline-none focus:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-gray-500 text-center">No results found</div>
                        ) : (
                            options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onMouseDown={(e) => { e.preventDefault(); onSelect(getOptionValue(option)); }}
                                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-gray-900 transition-colors"
                                >
                                    {renderOption(option)}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        {errors && errors[field] && <p className="text-red-500 text-[10px] mt-1">{errors[field]}</p>}
    </div>
);

export default SearchableDropdown;
