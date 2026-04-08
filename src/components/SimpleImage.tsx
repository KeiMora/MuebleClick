import React from 'react';

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SimpleImage: React.FC<SimpleImageProps> = ({ src, alt, className = '', style = {} }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        console.log(`Error cargando imagen: ${src}`);
        const target = e.target as HTMLImageElement;
        // Fallback SVG con colores de la paleta
        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%231a1a2e" width="300" height="200"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="16" font-weight="bold" x="50%25" y="45%25" text-anchor="middle" dominant-baseline="middle"%3E' + alt + '%3C/text%3E%3Ctext fill="%23e94560" font-family="Arial" font-size="12" x="50%25" y="55%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
      }}
      onLoad={() => {
        console.log(`Imagen cargada exitosamente: ${src}`);
      }}
    />
  );
};
