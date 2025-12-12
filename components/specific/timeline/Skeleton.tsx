export const Skeleton = ({
  width = "100%",
  height,
  borderRadius = "8px",
}: {
  width?: string | number;
  height: string | number;
  borderRadius?: string;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: "#f0f0f0",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        animation: "shimmer 1.5s infinite ease-in-out",
      }}
    />
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `,
      }}
    />
  </div>
);
