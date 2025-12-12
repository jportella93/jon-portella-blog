import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "./Skeleton";

export const LazyImage = ({
  src,
  alt,
  width,
  height,
  style = {},
  onError,
  disableLazy = false,
  loading,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onError?: () => void;
  disableLazy?: boolean;
  loading?: "lazy" | "eager";
  [key: string]: any;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(disableLazy);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableLazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before the element comes into view
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [disableLazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  const containerHeight = height ? `${height}px` : "auto";

  return (
    <div
      ref={containerRef}
      style={{
        width: width ? `${width}px` : "100%",
        height: containerHeight,
        position: "relative",
        ...style,
      }}
    >
      {!isInView ? (
        <Skeleton
          width="100%"
          height={height ? `${height}px` : "200px"}
          borderRadius="8px"
        />
      ) : hasError ? (
        <div
          style={{
            width: "100%",
            height: height ? `${height}px` : "200px",
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          Failed to load image
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading || (disableLazy ? "eager" : "lazy")}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};
