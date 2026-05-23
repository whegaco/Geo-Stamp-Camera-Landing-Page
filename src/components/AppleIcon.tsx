import React from 'react';

export default function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.89 3.87 2.07-3.1 1.77-2.61 5.86.6 7.02-.75 1.52-1.74 2.87-3.12 3.92zm-5.2-13.88c-.28-1.61 1.25-3.25 3.06-3.4.15 1.83-1.54 3.48-3.06 3.4z"/>
    </svg>
  );
}
