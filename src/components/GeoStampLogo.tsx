export default function GeoStampLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="120" rx="32" fill="#C6FF00" />
      {/* Camera Body */}
      <rect x="20" y="36" width="80" height="60" rx="14" stroke="#0f172a" strokeWidth="8" />
      {/* Viewfinder/Flash */}
      <circle cx="34" cy="50" r="4" fill="#0f172a" />
      {/* Camera shutter button */}
      <path d="M30 36 L30 30 C30 28 32 26 34 26 L46 26 C48 26 50 28 50 30 L50 36" fill="#0f172a" />
      
      {/* Main lens / Map pin drop */}
      <path fillRule="evenodd" clipRule="evenodd" d="M60 48C53.3726 48 48 53.3726 48 60C48 66.8687 54 82 60 82C66 82 72 66.8687 72 60C72 53.3726 66.6274 48 60 48ZM60 64C57.7909 64 56 62.2091 56 60C56 57.7909 57.7909 56 60 56C62.2091 56 64 57.7909 64 60C64 62.2091 62.2091 64 60 64Z" fill="#0f172a" />
      
      {/* Outer lens ring */}
      <circle cx="60" cy="61" r="22" stroke="#0f172a" strokeWidth="6" />
    </svg>
  );
}
