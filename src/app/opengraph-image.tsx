import { ImageResponse } from "next/og";

export const alt =
  "Devion Tharpe — Senior Solutions Engineer and AI builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#eef0f3",
        color: "#171717",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #c9ced6",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "1020px",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#1f638f",
            display: "flex",
            fontSize: "24px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Solutions engineering in practice
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.08,
          }}
        >
          Devion Tharpe
        </div>
        <div
          style={{
            color: "#555b63",
            display: "flex",
            fontSize: "30px",
            lineHeight: 1.35,
          }}
        >
          Senior Solutions Engineer building production-minded AI experiences.
        </div>
      </div>
    </div>,
    size
  );
}
