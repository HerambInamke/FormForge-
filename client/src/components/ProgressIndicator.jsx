import React, { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

// Interface for the component props
const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  labels = [], 
  showPercentage = true,
  animationDuration = 400,
  preferReducedMotion = false
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const actualProgress = (currentStep / totalSteps) * 100;
  
  // Animated progress effect
  useEffect(() => {
    if (preferReducedMotion) {
      setAnimatedProgress(actualProgress);
      return;
    }
    
    let start;
    const startValue = animatedProgress;
    const duration = animationDuration;
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedProgress(startValue + (actualProgress - startValue) * progress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [currentStep, totalSteps, animationDuration, preferReducedMotion, actualProgress, animatedProgress]);

  // Generate step items
  const steps = labels.length ? labels : Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);
  
  return (
    <div className="w-full flex flex-col items-center mb-8 pt-8">
      {/* Percentage display */}
      {showPercentage && (
        <div className="mb-4 font-semibold text-sm text-primary-600">
          <span className="text-lg">{Math.round(actualProgress)}%</span> Complete
        </div>
      )}
      
      <div className="w-full max-w-3xl px-4 md:px-8">
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full mb-8">
          <div 
            className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${animatedProgress}%` }}
          />
          
          {/* Step Circles */}
          <div className="absolute top-0 left-0 transform -translate-y-1/2 w-full">
            {steps.map((label, idx) => {
              const stepNumber = idx + 1;
              const stepPercentage = (idx / (steps.length - 1)) * 100;
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep - 1;
              
              return (
                <div
                  key={idx}
                  className="absolute"
                  style={{ 
                    left: `${stepPercentage}%`,
                    transform: 'translate(-50%, 0)'
                  }}
                >
                  <div 
                    className={`
                      flex items-center justify-center rounded-full border-2 
                      transition-all duration-300 shadow-md
                      ${isCompleted 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : isCurrent 
                          ? 'bg-white border-indigo-600 text-indigo-700' 
                          : 'bg-white border-gray-300 text-gray-500'}
                      w-8 h-8 text-sm font-medium
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                  
                  {/* Step Text Label - positioned below */}
                  <div 
                    className={`
                      absolute left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap
                      text-xs font-medium transition-all duration-300
                      ${isCompleted 
                        ? 'text-indigo-700' 
                        : isCurrent 
                          ? 'text-indigo-700 font-semibold'
                          : 'text-gray-500'}
                    `}
                    style={{
                      width: 'max-content',
                      maxWidth: '120px'
                    }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Spacer for labels */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default ProgressIndicator; 