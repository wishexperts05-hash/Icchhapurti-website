import React from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage component with WebP support and automatic fallback
 * Provides lazy loading by default with configurable loading strategy
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    width,
    height,
    onError,
    ...props
}) => {
    // Convert image path to WebP if it's a local image
    const getWebPPath = (imagePath) => {
        if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }

        const ext = imagePath.match(/\.(jpg|jpeg|png)$/i);
        if (ext) {
            return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return imagePath;
    };

    const webpSrc = getWebPPath(src);
    const fallbackSrc = src;

    const handleError = (e) => {
        // Fallback to original image if WebP fails
        if (e.target.src === webpSrc && webpSrc !== fallbackSrc) {
            e.target.src = fallbackSrc;
        }

        if (onError) {
            onError(e);
        }
    };

    return (
        <picture>
            {webpSrc !== fallbackSrc && (
                <source srcSet={webpSrc} type="image/webp" />
            )}
            <img
                src={fallbackSrc}
                alt={alt}
                className={className}
                loading={loading}
                width={width}
                height={height}
                onError={handleError}
                {...props}
            />
        </picture>
    );
};

OptimizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    loading: PropTypes.oneOf(['lazy', 'eager']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onError: PropTypes.func,
};

export default OptimizedImage;
