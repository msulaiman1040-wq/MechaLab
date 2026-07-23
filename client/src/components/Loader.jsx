import "./Loader.css";

export default function Loader({ text = "INITIALIZING MECHALAB SYSTEM..." }) {
  return (
    <div className="loader-overlay">
      {/* Background Cyber Grid / Scanline FX */}
      <div className="loader-scanlines" />

      <div className="loader-container">
        {/* Glowing Cobalt Ring Spinner */}
        <div className="cyber-ring-outer">
          <div className="cyber-ring-inner" />
          <div className="loader-core-dot" />
        </div>

        {/* Tactical Telemetry Text */}
        <div className="loader-text-wrapper">
          <span className="loader-sys-tag">[SYS_DIAGNOSTICS]</span>
          <p className="loader-status-text">{text}</p>
        </div>
      </div>
    </div>
  );
}