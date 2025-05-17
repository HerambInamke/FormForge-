import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as formContext } from '../context/FormContext'; // Renamed to formContext to avoid conflict
import { useAuth } from '../context/AuthContext';
import { page1Schema } from '../validations/formSchema';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import ProgressIndicator from './ProgressIndicator';
import CardStack from './CardStack';

// This is now unused since sticking with zodResolver (page1Schema)
const validateForm = (data) => {
  const errors = {};
  
  if (!data.name) errors.name = 'Name is required';
  if (!data.email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
  if (!data.addressLine1) errors.addressLine1 = 'Address Line 1 is required';
  if (!data.city) errors.city = 'City is required';
  if (!data.state) errors.state = 'State is required';
  if (!data.zipcode) errors.zipcode = 'ZIP Code is required';
  else if (!/^\d{5}(-\d{4})?$/.test(data.zipcode)) errors.zipcode = 'ZIP Code is invalid';
  
  return errors;
};

// Replace the steps array with the page labels
const pageLabels = ['Personal Information', 'Educational Status', 'Projects', 'Summary'];

const FormPage1 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = formContext(); // Changed from useFormContext to formContext
  const { token, user } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedData = useRef(false);

  // Add handleChange function for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData('page1', {
      ...formData.page1,
      [name]: value
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(page1Schema),
    defaultValues: {
      name: formData.page1?.name || '',
      email: formData.page1?.email || '',
      addressLine1: formData.page1?.addressLine1 || '',
      addressLine2: formData.page1?.addressLine2 || '',
      city: formData.page1?.city || '',
      state: formData.page1?.state || '',
      zipcode: formData.page1?.zipcode || ''
    }
  });

  useEffect(() => {
    const fetchSavedData = async () => {
      if (!token || hasLoadedData.current) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/form/page1', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.page1) {
            reset(data.page1, { keepDefaultValues: true });
            updateFormData('page1', data.page1);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error fetching saved data');
        }
      } catch (error) {
        setError('Error fetching saved data');
      } finally {
        setIsLoading(false);
        hasLoadedData.current = true;
      }
    };

    fetchSavedData();
  }, [token, reset, updateFormData]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/form/page1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        updateFormData('page1', data);
        navigate('/form/page2');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error saving form data');
      }
    } catch (error) {
      setError('Error saving form data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      {/* User Email Info */}
      <div className="w-full flex justify-center pt-6">
        <div className="text-sm text-indigo-900 font-medium bg-indigo-50 rounded px-4 py-2 shadow-sm">
          {user?.email ? (
            <span>Logged in as: <span className="font-semibold">{user.email}</span></span>
          ) : (
            <span>Logged in</span>
          )}
        </div>
      </div>
      
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={1} 
        totalSteps={4} 
        labels={pageLabels}
        showPercentage={true}
      />
      
      {/* Direct form card - no CardStack */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl bg-white animate-fade-in">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Information</h2>
            <p className="text-lg text-gray-500">We need some basic information to get started</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-500 rounded-md animate-fade-in text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    placeholder="Street address, P.O. box, company name"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.addressLine1 ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    {...register('addressLine1')}
                  />
                  {errors.addressLine1 && <p className="mt-1 text-sm text-red-500">{errors.addressLine1.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.addressLine2 ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    {...register('addressLine2')}
                  />
                  {errors.addressLine2 && <p className="mt-1 text-sm text-red-500">{errors.addressLine2.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Enter city name"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                      {...register('city')}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Enter state"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.state ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                      {...register('state')}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="zipcode"
                    type="text"
                    placeholder="12345 or 12345-6789"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.zipcode ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    {...register('zipcode')}
                  />
                  {errors.zipcode && <p className="mt-1 text-sm text-red-500">{errors.zipcode.message}</p>}
                </div>
              </div>
            </div>
            
            {/* Buttons fixed at the bottom */}
            <div className="flex justify-between pt-4 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Next Step'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPage1;