import { ImageResponse } from "next/og";

export const alt =
  "Devion Tharpe | Senior Solutions Engineer and AI builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#1a1916",
        color: "#f4efdf",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #4a463d",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "52px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#e2ad45",
            display: "flex",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          DEVION THARPE / SOLUTIONS ENGINEERING
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "86px",
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.9,
          }}
        >
          <div style={{ display: "flex" }}>Customer problems.</div>
          <div style={{ display: "flex" }}>Production paths.</div>
        </div>
        <div
          style={{
            borderTop: "1px solid #4a463d",
            color: "#aaa394",
            display: "flex",
            fontSize: "24px",
            lineHeight: 1.35,
            paddingTop: "24px",
          }}
        >
          Senior Solutions Engineer building credible AI systems.
        </div>
      </div>
    </div>,
    size
  );
}
