import React, { useState, useEffect } from 'react';

const CardStack = ({ 
  children, 
  currentPage, 
  totalPages, 
  transitionDuration = 400,
  pageLabels = [],
  preferReducedMotion = false
}) => {
  // State to track the rendered children for animation
  const [displayedChildren, setDisplayedChildren] = useState([]);
  const [previousPage, setPreviousPage] = useState(currentPage);
  const [transitionDirection, setTransitionDirection] = useState('next');
  
  // Update displayed children when current page changes
  useEffect(() => {
    // Determine direction of transition
    const direction = currentPage > previousPage ? 'next' : 'prev';
    setTransitionDirection(direction);
    
    // Create array of all children for rendering
    const childrenArray = React.Children.toArray(children);
    
    // Calculate which children to display in the stack
    const childrenToDisplay = [];
    
    // Current page is always displayed
    if (childrenArray[currentPage - 1]) {
      childrenToDisplay.push({
        child: childrenArray[currentPage - 1],
        position: 'current',
        key: `page-${currentPage}`
      });
    }
    
    // Add previous page if it exists
    if (currentPage > 1 && childrenArray[currentPage - 2]) {
      childrenToDisplay.push({
        child: childrenArray[currentPage - 2],
        position: 'prev',
        key: `page-${currentPage - 1}`
      });
    }
    
    // Add next page if it exists
    if (currentPage < totalPages && childrenArray[currentPage]) {
      childrenToDisplay.push({
        child: childrenArray[currentPage],
        position: 'next',
        key: `page-${currentPage + 1}`
      });
    }
    
    setDisplayedChildren(childrenToDisplay);
    setPreviousPage(currentPage);
  }, [children, currentPage, totalPages]);
  
  // Animation classes
  const getAnimationClasses = (position) => {
    // Base classes
    let baseClasses = "absolute inset-0 transition-all rounded-xl shadow-xl";
    
    // Duration based on preference
    const duration = preferReducedMotion ? '0' : transitionDuration;
    baseClasses += ` duration-${duration}`;
    
    // Position-specific classes
    switch (position) {
      case 'current':
        return `${baseClasses} z-20 bg-white opacity-100 transform-none`;
      case 'prev':
        return `${baseClasses} z-10 bg-white opacity-60 transform -translate-x-[15%] scale-[0.95]`;
      case 'next':
        return `${baseClasses} z-10 bg-white opacity-60 transform translate-x-[15%] scale-[0.95]`;
      default:
        return baseClasses;
    }
  };
  
  // Entry and exit animations
  const getTransitionClasses = (position) => {
    // If reduced motion, don't animate
    if (preferReducedMotion) {
      return '';
    }
    
    // Define starting positions for entry animations
    const entryClasses = {
      current: {
        next: 'translate-x-[100%] scale-[0.9] opacity-0',
        prev: '-translate-x-[100%] scale-[0.9] opacity-0'
      },
      prev: {
        next: '-translate-x-[30%] opacity-0',
        prev: '-translate-x-[100%] opacity-0'
      },
      next: {
        next: 'translate-x-[100%] opacity-0',
        prev: 'translate-x-[30%] opacity-0'
      }
    };
    
    return entryClasses[position]?.[transitionDirection] || '';
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Progress indicator dots */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div 
            key={`dot-${i}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${i + 1 === currentPage 
                ? 'bg-primary-600 w-6' 
                : i + 1 < currentPage 
                  ? 'bg-primary-400' 
                  : 'bg-secondary-300'}`}
          />
        ))}
      </div>
      
      {/* Card stack container */}
      <div className="relative w-full h-full overflow-hidden">
        {displayedChildren.map(({ child, position, key }) => (
          <div
            key={key}
            className={`${getAnimationClasses(position)} group`}
            data-position={position}
          >
            {/* Entry animation wrapper */}
            <div 
              className={`w-full h-full transform transition-all ${getTransitionClasses(position)}`}
            >
              {/* Card content */}
              <div className="w-full h-full overflow-hidden">
                {child}
              </div>
            </div>
            
            {/* Page labels (if present) */}
            {pageLabels[parseInt(key.split('-')[1]) - 1] && position === 'current' && (
              <div className="absolute top-0 right-0 bg-primary-100 text-primary-800 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                {pageLabels[parseInt(key.split('-')[1]) - 1]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress text */}
      <div className="absolute bottom-4 right-4 text-xs text-secondary-500 font-medium">
        {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default CardStack; 