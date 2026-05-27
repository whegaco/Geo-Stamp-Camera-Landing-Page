import { useState, useEffect } from 'react';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
}

export default function BlurImage({ src, alt, containerClassName = "", imageClassName = "", ...props }: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // For Unsplash images, we can generate a tiny blurred placeholder URL
  const isUnsplash = src.includes('images.unsplash.com');
  const placeholderSrc = isUnsplash 
    ? src.replace('&q=80', '&q=1').replace('&w=800', '&w=50').replace('&w=1200', '&w=50') + '&blur=100' 
    : src;

  return (
    <div className={`relative overflow-hidden bg-slate-800 ${containerClassName}`}>
      {/* Placeholder */}
      <img
        src={placeholderSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-0' : 'opacity-100'} ${imageClassName}`}
      />
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-110'
        } ${imageClassName}`}
        {...props}
      />
    </div>
  );
}
