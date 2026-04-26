import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timer de Apresentação — Rhema AI",
  description: "Timer de palco controlado remotamente",
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        color: "var(--fg-1)",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="rh-atmo" />
      <div className="rh-atmo-noise" />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
