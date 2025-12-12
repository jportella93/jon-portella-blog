import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "./Skeleton";

export const LazyIframe = ({
  src,
  title,
  width = "100%",
  height = "315",
  style = {},
  allow,
  allowFullScreen = false,
  disableLazy = false,
  onLoad: userOnLoad,
  onError: userOnError,
  ...props
}: {
  src: string;
  title: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  allow?: string;
  allowFullScreen?: boolean;
  disableLazy?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLIFrameElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLIFrameElement>) => void;
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
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "100px", // Start loading 100px before the element comes into view, unload when 100px out of view
        threshold: 0.1, // Trigger when 10% of the element is visible/invisible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [disableLazy]);

  const handleLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoaded(true);
    setHasError(false);
    userOnLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    setHasError(true);
    setIsLoaded(true);
    userOnError?.(event);
  };

  // For responsive containers, use auto height; otherwise convert to number
  const heightValue =
    height === "100%"
      ? "100%"
      : typeof height === "string"
        ? parseInt(height.toString())
        : height;
  const containerHeight = hasError ? "auto" : height;
  const getHeightStyle = (isMinHeight = false) =>
    height === "100%" ? "100%" : isMinHeight ? `${heightValue}px` : height;

  return (
    <div
      ref={containerRef}
      style={{
        width: width,
        height: containerHeight,
        position: "relative",
        minHeight: hasError ? "auto" : getHeightStyle(true),
        ...style,
      }}
    >
      {!isInView ? (
        <Skeleton width="100%" height={getHeightStyle()} borderRadius="8px" />
      ) : hasError ? (
        <div
          style={{
            width: "100%",
            height: getHeightStyle(),
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          Failed to load video
        </div>
      ) : (
        <>
          <iframe
            src={src}
            title={title}
            width="100%"
            height={getHeightStyle()}
            allow={allow}
            allowFullScreen={allowFullScreen}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              border: 0,
              borderRadius: "8px",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
            {...props}
          />
          {!isLoaded && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: getHeightStyle(),
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            >
              <Skeleton
                width="100%"
                height={getHeightStyle()}
                borderRadius="8px"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
