import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import { page2Schema } from '../validations/formSchema';
import ProgressIndicator from './ProgressIndicator';
import CardStack from './CardStack';

const pageLabels = ['Personal Information', 'Educational Status', 'Projects', 'Summary'];

const API_BASE_URL = 'https://formforge-yvcs.onrender.com';

const FormPage2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchAttempted = useRef(false);
  const controller = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
    setError: setFormError
  } = useForm({
    resolver: zodResolver(page2Schema),
    defaultValues: {
      isStudying: formData.page2?.isStudying || 'false',
      studyLocation: formData.page2?.studyLocation || ''
    },
    mode: 'onChange'
  });

  const isStudying = watch('isStudying');
  
  useEffect(() => {
    const fetchSavedData = async () => {
      if (!token || fetchAttempted.current) {
        setIsLoading(false);
        return;
      }
      if (controller.current) {
        controller.current.abort();
      }
      controller.current = new AbortController();
      try {
        fetchAttempted.current = true;
        const response = await fetch(`${API_BASE_URL}/api/form/page2`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.current.signal
        });
        if (response.ok) {
          const data = await response.json();
          if (data.page2) {
            reset({
              isStudying: data.page2.isStudying || 'false',
              studyLocation: data.page2.studyLocation || ''
            });
            updateFormData('page2', data.page2);
          }
        } else if (response.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error fetching form data');
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        setError('Error fetching form data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedData();
    return () => {
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, [token, reset, updateFormData]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/form/page2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Update form data
        updateFormData('page2', data);
        // Use correct navigation path
        navigate('/form/page3');
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
        currentStep={2} 
        totalSteps={4} 
        labels={pageLabels}
        showPercentage={true}
      />
      
      {/* Direct form card - no CardStack */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl bg-white animate-fade-in">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Educational Status</h2>
            <p className="text-lg text-gray-500">Tell us about your education</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-500 rounded-md animate-fade-in text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you currently studying? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setValue('isStudying', 'true')}
                    className={`
                      border rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200
                      ${isStudying === 'true' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30'}
                    `}
                  >
                    <input
                      type="radio"
                      id="studying-yes"
                      value="true"
                      className="sr-only"
                      {...register('isStudying')}
                    />
                    <label htmlFor="studying-yes" className="font-medium cursor-pointer flex items-center">
                      <span className={`w-4 h-4 mr-2 rounded-full border ${isStudying === 'true' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                        {isStudying === 'true' && (
                          <span className="block w-2 h-2 mx-auto mt-1 bg-white rounded-full"></span>
                        )}
                      </span>
                      Yes
                    </label>
                  </div>
                  <div
                    onClick={() => setValue('isStudying', 'false')}
                    className={`
                      border rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200
                      ${isStudying === 'false' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30'}
                    `}
                  >
                    <input
                      type="radio"
                      id="studying-no"
                      value="false"
                      className="sr-only"
                      {...register('isStudying')}
                    />
                    <label htmlFor="studying-no" className="font-medium cursor-pointer flex items-center">
                      <span className={`w-4 h-4 mr-2 rounded-full border ${isStudying === 'false' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                        {isStudying === 'false' && (
                          <span className="block w-2 h-2 mx-auto mt-1 bg-white rounded-full"></span>
                        )}
                      </span>
                      No
                    </label>
                  </div>
                </div>
                {errors.isStudying && (
                  <p className="mt-1 text-sm text-red-500">{errors.isStudying.message}</p>
                )}
              </div>

              {isStudying === 'true' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="studyLocation" className="block text-sm font-medium text-gray-700">
                      Where are you studying? <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="studyLocation"
                      placeholder="Enter your school or institution name"
                      {...register('studyLocation')}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.studyLocation ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                    />
                    {errors.studyLocation && (
                      <p className="mt-1 text-sm text-red-500">{errors.studyLocation.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                      Field of Study
                    </label>
                    <input
                      id="fieldOfStudy"
                      placeholder="E.g., Computer Science, Engineering, Arts"
                      {...register('fieldOfStudy')}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                      Degree/Certification
                    </label>
                    <input
                      id="degree"
                      placeholder="E.g., Bachelor's, Master's, Certificate"
                      {...register('degree')}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="yearStarted" className="block text-sm font-medium text-gray-700">
                        Year Started
                      </label>
                      <input
                        id="yearStarted"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        {...register('yearStarted')}
                        placeholder={new Date().getFullYear().toString()}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="expectedGraduation" className="block text-sm font-medium text-gray-700">
                        Expected Graduation
                      </label>
                      <input
                        id="expectedGraduation"
                        type="number"
                        min={new Date().getFullYear()}
                        max="2100"
                        {...register('expectedGraduation')}
                        placeholder={(new Date().getFullYear() + 4).toString()}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isStudying === 'false' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="highestEducation" className="block text-sm font-medium text-gray-700">
                      Highest Level of Education <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="highestEducation"
                      {...register('highestEducation')}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Associate's Degree">Associate's Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.highestEducation && (
                      <p className="mt-1 text-sm text-red-500">{errors.highestEducation.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Buttons fixed at the bottom */}
            <div className="flex justify-between pt-4 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/form/page1')}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Previous
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

export default FormPage2; 