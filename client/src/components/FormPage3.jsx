import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import { page3Schema } from '../validations/formSchema';
import ProgressIndicator from './ProgressIndicator';
import CardStack from './CardStack';

const pageLabels = ['Personal Information', 'Educational Status', 'Projects', 'Summary'];

const API_BASE_URL = 'https://formforge-yvcs.onrender.com';

const FormPage3 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();
  const { token, user } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchAttempted = useRef(false);
  const controller = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(page3Schema),
    defaultValues: {
      projects: formData.page3?.projects || [{
        title: '',
        description: '',
        githubLink: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  });

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
        const response = await fetch(`${API_BASE_URL}/api/form/page3`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.current.signal
        });
        if (response.ok) {
          const data = await response.json();
          if (data.page3) {
            reset({
              projects: data.page3.projects || [{
                title: '',
                description: '',
                githubLink: ''
              }]
            });
            updateFormData('page3', data.page3);
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
      
      const response = await fetch(`${API_BASE_URL}/api/form/page3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Update form data
        updateFormData('page3', data);
        // Use correct navigation path
        navigate('/form/summary');
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
        currentStep={3} 
        totalSteps={4} 
        labels={pageLabels}
        showPercentage={true}
      />
      
      {/* Direct form card - no CardStack */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl bg-white animate-fade-in">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Projects</h2>
            <p className="text-lg text-gray-500">Tell us about your recent projects</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-500 rounded-md animate-fade-in text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4 animate-fade-in shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700 text-lg">Project {index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        aria-label="Remove project"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor={`projects.${index}.title`} className="block text-sm font-medium text-gray-700">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`projects.${index}.title`}
                        placeholder="Enter your project name"
                        {...register(`projects.${index}.title`)}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.projects?.[index]?.title ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                      />
                      {errors.projects?.[index]?.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.projects[index].title.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`projects.${index}.description`} className="block text-sm font-medium text-gray-700">
                        Project Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`projects.${index}.description`}
                        placeholder="Describe your project, its purpose, and your role in it"
                        {...register(`projects.${index}.description`)}
                        rows="4"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.projects?.[index]?.description ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                      />
                      {errors.projects?.[index]?.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.projects[index].description.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`projects.${index}.githubLink`} className="block text-sm font-medium text-gray-700">
                        GitHub Link <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        id={`projects.${index}.githubLink`}
                        type="url"
                        placeholder="https://github.com/yourusername/project"
                        {...register(`projects.${index}.githubLink`)}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.projects?.[index]?.githubLink ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                      />
                      {errors.projects?.[index]?.githubLink && (
                        <p className="mt-1 text-sm text-red-500">{errors.projects[index].githubLink.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Project Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => append({ title: '', description: '', githubLink: '' })}
                className="inline-flex items-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Another Project
              </button>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/form/page2')}
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

export default FormPage3; 