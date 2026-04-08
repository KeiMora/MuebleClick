import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText = alt,
  width = 300,
  height = 200,
  style = {}
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log(`Error cargando imagen: ${src}, usando fallback`);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log(`Imagen cargada exitosamente: ${src}`);
    setIsLoading(false);
  };

  // Generar SVG fallback con colores de la paleta
  const generateFallbackSVG = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect fill="#1a1a2e" width="${width}" height="${height}"/>
        <text fill="#ffffff" font-family="Arial" font-size="${Math.min(width/15, 20)}" font-weight="bold" x="50%" y="45%" text-anchor="middle" dominant-baseline="middle">
          ${fallbackText.length > 20 ? fallbackText.substring(0, 20) + '...' : fallbackText}
        </text>
        <text fill="#e94560" font-family="Arial" font-size="${Math.min(width/20, 16)}" x="50%" y="55%" text-anchor="middle" dominant-baseline="middle">
          Imagen no disponible
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Si hay error, mostrar fallback SVG
  if (hasError) {
    return (
      <img
        src={generateFallbackSVG()}
        alt={alt}
        className={className}
        style={{
          ...style,
          border: '2px solid #e94560',
          borderRadius: '8px'
        }}
        width={width}
        height={height}
      />
    );
  }

  // Mientras carga, mostrar placeholder
  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          ...style,
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '200px',
          backgroundColor: '#1a1a2e',
          border: '2px solid #3282b8',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '14px'
        }}
      >
        Cargando...
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};
