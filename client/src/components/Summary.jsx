import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import ProgressIndicator from './ProgressIndicator';
import CardStack from './CardStack';
import { useState } from 'react';

const pageLabels = ['Personal Information', 'Educational Status', 'Projects', 'Summary'];

const Summary = () => {
  const navigate = useNavigate();
  const { formData } = useForm();
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Navigate to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error submitting form');
      }
    } catch (error) {
      setError('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

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
        currentStep={4} 
        totalSteps={4} 
        labels={pageLabels}
        showPercentage={true}
      />
      
      {/* Direct form card - no CardStack */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl bg-white animate-fade-in">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Review & Submit</h2>
            <p className="text-lg text-gray-500">Please verify your information before submitting</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-500 rounded-md animate-fade-in text-center">
              {error}
            </div>
          )}
          
          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md animate-fade-in text-center">
              Form submitted successfully!
            </div>
          )}
          
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
            {/* Personal Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg text-gray-800">Personal Information</h3>
                <button
                  type="button"
                  onClick={() => navigate('/form/page1')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{formData?.page1?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{formData?.page1?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{formData?.page1?.addressLine1 || 'Not provided'}</p>
                  {formData?.page1?.addressLine2 && <p className="font-medium">{formData.page1.addressLine2}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {formData?.page1 ? [formData.page1.city, formData.page1.state, formData.page1.zipcode].filter(Boolean).join(', ') || 'Not provided' : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Educational Status */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg text-gray-800">Educational Status</h3>
                <button
                  type="button"
                  onClick={() => navigate('/form/page2')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="mt-2">
                <div>
                  <p className="text-sm text-gray-500">Currently Studying</p>
                  <p className="font-medium">{formData?.page2?.isStudying === 'true' ? 'Yes' : 'No'}</p>
                </div>
                
                {formData?.page2?.isStudying === 'true' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Study Location</p>
                      <p className="font-medium">{formData?.page2?.studyLocation || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Field of Study</p>
                      <p className="font-medium">{formData?.page2?.fieldOfStudy || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Degree/Certification</p>
                      <p className="font-medium">{formData?.page2?.degree || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year Started - Expected Graduation</p>
                      <p className="font-medium">
                        {formData?.page2?.yearStarted ? formData.page2.yearStarted : 'N/A'} - {formData?.page2?.expectedGraduation ? formData.page2.expectedGraduation : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                
                {formData?.page2?.isStudying === 'false' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Highest Education</p>
                    <p className="font-medium">{formData?.page2?.highestEducation || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Projects */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg text-gray-800">Projects</h3>
                <button
                  type="button"
                  onClick={() => navigate('/form/page3')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              
              {formData?.page3?.projects && formData.page3.projects.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {formData.page3.projects.map((project, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium text-indigo-700">{project?.title || 'Untitled Project'}</h4>
                      <p className="text-sm text-gray-700 mt-1">{project?.description || 'No description provided'}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm">{project?.startDate || 'N/A'}</p>
                        </div>
                        {project?.endDate && (
                          <div>
                            <p className="text-xs text-gray-500">End Date</p>
                            <p className="text-sm">{project.endDate}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Technologies</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project?.technologies ? project.technologies.split(',').map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                            >
                              {tech.trim()}
                            </span>
                          )) : (
                            <span className="text-sm text-gray-500">None specified</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-3">
                        {project?.githubLink && (
                          <a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                        )}
                        {project?.liveLink && (
                          <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mt-2">No projects added</p>
              )}
            </div>
          </div>
          
          {/* Buttons fixed at the bottom */}
          <div className="flex justify-between pt-4 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/form/page3')}
              className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary; 