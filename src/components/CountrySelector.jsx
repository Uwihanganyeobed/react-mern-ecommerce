import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { ClipLoader } from 'react-spinners';

const CountrySelector = ({ value, onChange, error }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
        const data = await response.json();
        
        // Sort countries alphabetically
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  const handleSelect = (country) => {
    onChange(country.name.common);
    setIsOpen(false);
  };

  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find(country => country.name.common === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country
      </label>
      
      <button
        type="button"
        onClick={handleToggle}
        className={`relative w-full bg-white border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {loading ? (
          <div className="flex items-center">
            <ClipLoader size={16} color="#6366F1" />
            <span className="ml-2 block truncate text-gray-500">Loading countries...</span>
          </div>
        ) : selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flags.svg} 
              alt={`${selectedCountry.name.common} flag`} 
              className="h-4 w-6 object-cover mr-2"
            />
            <span className="block truncate">{selectedCountry.name.common}</span>
          </div>
        ) : (
          <span className="block truncate text-gray-500">Select a country</span>
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md overflow-hidden">
          <div className="sticky top-0 z-10 bg-white p-2 border-b">
            <input
              ref={searchRef}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ul 
            className="py-1 overflow-auto max-h-64 text-base"
            role="listbox"
          >
            {loading ? (
              <li className="text-center py-4">
                <ClipLoader size={24} color="#6366F1" />
              </li>
            ) : filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li
                  key={country.cca2}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                    value === country.name.common ? 'bg-indigo-100' : ''
                  }`}
                  onClick={() => handleSelect(country)}
                  role="option"
                  aria-selected={value === country.name.common}
                >
                  <div className="flex items-center">
                    <img 
                      src={country.flags.svg} 
                      alt={`${country.name.common} flag`} 
                      className="h-4 w-6 object-cover mr-2"
                    />
                    <span className={`block truncate ${
                      value === country.name.common ? 'font-medium' : 'font-normal'
                    }`}>
                      {country.name.common}
                    </span>
                  </div>

                  {value === country.name.common && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-center py-4 text-gray-500">No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector; 