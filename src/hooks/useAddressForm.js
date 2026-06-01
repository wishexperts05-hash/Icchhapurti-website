import { useState, useEffect, useRef } from 'react';

export default function useAddressForm({ fetchAddresses, setAddressesIndex, setAuthStage, authStage }) {
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        mobileNumber: '',
        countryCode: '+91',
        countryIsoCode: 'IN',
        stateIsoCode: '',
        country: 'India',
        state: '',
        city: '',
        street: '',
        pinCode: ''
    });
    const [addressErrors, setAddressErrors] = useState({});
    const [locationDropdown, setLocationDropdown] = useState(null); // 'countryCode' | 'country' | 'state' | 'city' | null
    const [searchTerms, setSearchTerms] = useState({ countryCode: '', country: '', state: '', city: '' });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState({ countries: false, states: false, cities: false });
    const [addressSaving, setAddressSaving] = useState(false);
    const dropdownRefs = useRef({});

    // Location API calls
    const fetchCountries = async () => {
        const cached = sessionStorage.getItem('all_countries');
        if (cached) {
            const data = JSON.parse(cached);
            setCountries(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, countries: true }));
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/countries`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem('all_countries', JSON.stringify(data.data));
                setCountries(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch countries:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, countries: false }));
        }
        return [];
    };

    const fetchStates = async (countryIsoCode) => {
        if (!countryIsoCode) return [];
        const cacheKey = `states_${countryIsoCode}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            setStates(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, states: true }));
        setCities([]);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/states?country=${countryIsoCode}`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                setStates(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch states:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, states: false }));
        }
        return [];
    };

    const fetchCities = async (countryIsoCode, stateIsoCode) => {
        if (!countryIsoCode || !stateIsoCode) return [];
        const cacheKey = `cities_${countryIsoCode}_${stateIsoCode}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            setCities(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, cities: true }));
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/cities?country=${countryIsoCode}&state=${stateIsoCode}`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                setCities(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch cities:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, cities: false }));
        }
        return [];
    };

    // Location select handlers
    const handleSelectCountryCode = (phonecode) => {
        const matched = countries.find(c => c.phonecode === phonecode);
        setAddressForm(prev => ({
            ...prev,
            countryCode: `+${phonecode}`,
            ...(matched ? {
                countryIsoCode: matched.isoCode,
                country: matched.country,
                stateIsoCode: '', state: '', city: ''
            } : {})
        }));
        if (matched) { setStates([]); setCities([]); fetchStates(matched.isoCode); }
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, countryCode: '' }));
    };

    const handleSelectCountry = async (isoCode) => {
        const selected = countries.find(c => c.isoCode === isoCode);
        if (!selected) return;
        setAddressForm(prev => ({
            ...prev,
            countryIsoCode: selected.isoCode,
            country: selected.country,
            countryCode: selected.phonecode ? `+${selected.phonecode}` : prev.countryCode,
            stateIsoCode: '', state: '', city: ''
        }));
        setStates([]); setCities([]);
        if (addressErrors.country) setAddressErrors(prev => ({ ...prev, country: '' }));
        await fetchStates(selected.isoCode);
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, country: '' }));
    };

    const handleSelectState = async (isoCode) => {
        const selected = states.find(s => s.isoCode === isoCode);
        if (!selected) return;
        setAddressForm(prev => ({ ...prev, stateIsoCode: selected.isoCode, state: selected.name, city: '' }));
        setCities([]);
        if (addressErrors.state) setAddressErrors(prev => ({ ...prev, state: '' }));
        await fetchCities(addressForm.countryIsoCode, isoCode);
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, state: '' }));
    };

    const handleSelectCity = (cityName) => {
        setAddressForm(prev => ({ ...prev, city: cityName }));
        if (addressErrors.city) setAddressErrors(prev => ({ ...prev, city: '' }));
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, city: '' }));
    };

    // Address form submit
    const handleSaveAddress = async (e) => {
        if (e) e.preventDefault();

        const newErrors = {};
        if (!addressForm.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!addressForm.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
        else if (!/^\d{7,15}$/.test(addressForm.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
        if (!addressForm.country) newErrors.country = 'Country is required';
        if (!addressForm.state) newErrors.state = 'State is required';
        if (!addressForm.city) newErrors.city = 'City is required';
        if (!addressForm.street.trim()) newErrors.street = 'Street is required';
        if (!addressForm.pinCode) newErrors.pinCode = 'Pin code is required';

        if (Object.keys(newErrors).length > 0) {
            setAddressErrors(newErrors);
            return;
        }

        setAddressSaving(true);
        try {
            const addressData = {
                fullName: addressForm.fullName,
                phoneNumber: addressForm.mobileNumber,
                country: addressForm.country,
                state: addressForm.state,
                city: addressForm.city,
                street: addressForm.street,
                pinCode: addressForm.pinCode
            };
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/addAddress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressData)
            });
            if (res.ok) {
                await fetchAddresses();
                if (setAddressesIndex) setAddressesIndex(0);
                if (setAuthStage) setAuthStage('checkout');
            } else {
                const errData = await res.json();
                alert(errData.message || 'Failed to save address');
            }
        } catch (err) {
            console.error('Save Address Error:', err);
            alert('Failed to save address. Please try again.');
        } finally {
            setAddressSaving(false);
        }
    };

    // Filtered lists for address form selection
    const filteredCountryCodes = countries.filter(c =>
        `+${c.phonecode} ${c.country}`.toLowerCase().includes((searchTerms.countryCode || '').toLowerCase())
    );
    const filteredCountries = countries.filter(c =>
        c.country.toLowerCase().includes((searchTerms.country || '').toLowerCase())
    );
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes((searchTerms.state || '').toLowerCase())
    );
    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes((searchTerms.city || '').toLowerCase())
    );

    // Initial trigger for location lists
    useEffect(() => {
        if (authStage === 'add_address') {
            fetchCountries().then(async (allCountries) => {
                const india = allCountries.find(c => c.isoCode === 'IN');
                if (india) await fetchStates('IN');
            });
        }
    }, [authStage]);

    return {
        addressForm,
        setAddressForm,
        addressErrors,
        setAddressErrors,
        locationDropdown,
        setLocationDropdown,
        searchTerms,
        setSearchTerms,
        countries,
        states,
        cities,
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
    };
}
